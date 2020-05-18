using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using TaskManageMent.Data;
using TaskManageMent.TodosModel;

namespace TaskManageMent.TodosModel
{
    /// <summary>
    /// Diaryを管理する機能を提供します。
    /// </summary>
    public class DiaryManager
    {
        /// <summary>
        /// データベース接続用のクラスを取得します。
        /// </summary>
        /// <returns></returns>
        private SqlServerClient GetDatabaseClient()
        {
            // Web.configに設定した接続文字列を読み込む

            // Local Sql Server
            // var confingConnectionString = ConfigurationManager.ConnectionStrings["local_sqlserver"].ConnectionString;

            // Azure Sql Database
            var confingConnectionString = ConfigurationManager.ConnectionStrings["azure_sql_database"].ConnectionString;

            // データベース接続用クラスのインスタンスを生成
            return new SqlServerClient(confingConnectionString);
        }

        /// <summary>
        /// 全てのDiaryアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public DataTable GetAllDataTable()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from DIARY order by createdDate";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                return dt;
            }
        }

        /// <summary>
        /// 全てのDiaryアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public IEnumerable<DiaryItem> GetAll()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from DIARY order by createdDate";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをDiaryItemクラスに変換
                    yield return ConvertDataRowToInstance<DiaryItem>(row);
                }
            }
        }

        /// <summary>
        /// 指定したIdのDiaryアイテムを取得します。
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public DiaryItem Get(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"select * from DIARY where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql, p))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをDiaryItemクラスに変換
                    return ConvertDataRowToInstance<DiaryItem>(row);
                }
            }

            return null;
        }


        /// <summary>
        /// 指定したIdのDiaryアイテムを取得します。
        /// </summary>
        /// <param name="createdDate"></param>
        /// <returns></returns>
        public IEnumerable<DiaryItem> GetDiaryTitle(string createdDate)
        {
            var cl = GetDatabaseClient();
            var sql = "select * from DIARY where CreatedDate = @createdDate";
            var p = new Dictionary<string, object>
            {
                { "CreatedDate", createdDate }
            };
            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql,p))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをDiaryItemクラスに変換
                    yield return ConvertDataRowToInstance<DiaryItem>(row);
                }
            }
        }

        /// <summary>
        /// Diaryアイテムを追加します。
        /// </summary>
        /// <param name="diary"></param>
        /// <returns></returns>
        public DiaryItem Add(DiaryItem diary)
        {
            if (string.IsNullOrEmpty(diary.Id))
            {
                diary.Id = Guid.NewGuid().ToString();
            }

            // Save
            var cl = GetDatabaseClient();
            var sql = $"insert into [DIARY] (Id,Title,Contents,CreatedDate,Password,UserName) VALUES (@Id,@Title,@Contents,@CreatedDate,@Password,@UserName)";
            var p = new Dictionary<string, object>
            {
                { "Id", diary.Id },
                { "Title", diary.Title },
                { "Contents", diary.Contents },
                { "CreatedDate", diary.CreatedDate },
                { "Password", diary.Password },
                { "UserName", diary.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(diary.Id);
        }

        /// <summary>
        /// Diaryアイテムを更新します。
        /// </summary>
        /// <param name="diary"></param>
        /// <returns></returns>
        public DiaryItem Update(DiaryItem diary)
        {
            // Save
            var cl = GetDatabaseClient();
            var sql = $"update DIARY set Title = @Title, Contents = @Contents,CreatedDate =@CreatedDate,Password=@Password where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", diary.Id },
                { "Title", diary.Title },
                { "Contents", diary.Contents },
                { "CreatedDate", diary.CreatedDate },
                { "Password", diary.Password },
                { "UserName", diary.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(diary.Id);
        }

        /// <summary>
        /// Diaryアイテムを削除します。
        /// </summary>
        /// <param name="diary"></param>
        /// <returns></returns>
        public void Delete(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"delete DIARY where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };
            cl.ExecuteSql(sql, p);
        }

        /// <summary>
        /// DataRowからTで指定したクラスのインスタンスに変換します。
        /// ※ この機能は本来SqlServerClientにあるべきですが、説明の都合上ここに記述しています
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="row"></param>
        /// <returns></returns>
        private T ConvertDataRowToInstance<T>(DataRow row) where T : new()
        {
            // 指定されたクラスの情報を取得
            var type = typeof(T);

            // 指定されたクラスのプロパティ情報を取得
            var properties = type.GetProperties();

            // クラスのインスタンス生成
            var instance = new T();

            // プロパティをセットしていく
            foreach (var p in properties)
            {
                // DataRowにプロパティと同じ名前の列がなければ無視
                if (!row.Table.Columns.Contains(p.Name))
                {
                    continue;
                }

                var value = row[p.Name];

                // テーブルにNullが入っている場合、DBNullという特殊なNull値で返ってくる
                // このままだと変換できないので、nullに置き換える
                if (value == DBNull.Value)
                {
                    value = null;
                }

                // 取得した値をプロパティにセットする
                p.SetValue(instance, value);
            }

            return instance;

        }
    }
}