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
    /// addressを管理する機能を提供します。
    /// </summary>
    public class AddressManager
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
        /// 全てのaddressアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public DataTable GetAllDataTable()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from ADDRESS  order by Name";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                return dt;
            }
        }

        /// <summary>
        /// 全てのaddressアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public IEnumerable<AddressItem> GetAll()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from ADDRESS order by Name";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをaddresssItemクラスに変換
                    yield return ConvertDataRowToInstance<AddressItem>(row);
                }
            }
        }

        /// <summary>
        /// 指定したIdのaddressアイテムを取得します。
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public AddressItem Get(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"select * from ADDRESS where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql, p))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをaddresssItemクラスに変換
                    return ConvertDataRowToInstance<AddressItem>(row);
                }
            }

            return null;
        }

        /// <summary>
        /// addressアイテムを追加します。
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public AddressItem Add(AddressItem address)
        {
            if (string.IsNullOrEmpty(address.Id))
            {
                address.Id = Guid.NewGuid().ToString();
            }

            // Save
            var cl = GetDatabaseClient();
            var sql = $"insert into [address] (Id,Name,TellNum,Email,Company,Memo,UserName) VALUES (@Id,@Name,@TellNum,@Email,@Company,@Memo,@UserName)";
            var p = new Dictionary<string, object>
            {
                { "Id", address.Id },
                { "Name", address.Name },
                { "TellNum", address.TellNum },
                { "Email", address.Email },
                { "Company", address.Company },
                { "Memo", address.Memo },
                { "UserName", address.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(address.Id);
        }

        /// <summary>
        /// addressアイテムを更新します。
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public AddressItem Update(AddressItem address)
        {
            // Save
            var cl = GetDatabaseClient();
            var sql = $"update ADDRESS set Name = @Name, Memo = @Memo, Email=@Email, TellNum=@TellNum,Company=@Company where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", address.Id },
                { "Name", address.Name },
                { "TellNum", address.TellNum },
                { "Email", address.Email },
                { "Company", address.Company },
                { "Memo", address.Memo },
                { "UserName", address.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(address.Id);
        }

        /// <summary>
        /// addressアイテムを削除します。
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public void Delete(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"delete ADDRESS where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };
            cl.ExecuteSql(sql, p);
        }

        /// <summary>
        /// 全てのaddressアイテムを削除します。
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public void Clear()
        {
            var cl = GetDatabaseClient();
            var sql = $"delete ADDRESS";
            cl.ExecuteSql(sql);
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