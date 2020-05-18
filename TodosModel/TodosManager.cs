using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using TaskManageMent.Data;

namespace TaskManageMent.TodosModel
{
    /// <summary>
    /// ToDoを管理する機能を提供します。
    /// </summary>
    public class TodosManager
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
        /// 全てのToDoアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public DataTable GetAllDataTable()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from TODOS order by EndDate";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                return dt;
            }
        }

        /// <summary>
        /// 全てのToDoアイテムを取得します。
        /// </summary>
        /// <returns></returns>
        public IEnumerable<TodosItem> GetAll()
        {
            var cl = GetDatabaseClient();
            var sql = "select * from TODOS order by EndDate";

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをTodosItemクラスに変換
                    yield return ConvertDataRowToInstance<TodosItem>(row);
                }
            }
        }

        /// <summary>
        /// 指定したIdのToDoアイテムを取得します。
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public TodosItem Get(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"select * from TODOS where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };

            // Sqlを実行してデータを取得
            using (var dt = cl.Select(sql, p))
            {
                foreach (DataRow row in dt.Rows)
                {
                    // DataRowをTodosItemクラスに変換
                    return ConvertDataRowToInstance<TodosItem>(row);
                }
            }

            return null;
        }

        /// <summary>
        /// ToDoアイテムを追加します。
        /// </summary>
        /// <param name="todo"></param>
        /// <returns></returns>
        public TodosItem Add(TodosItem todo)
        {
            if (string.IsNullOrEmpty(todo.Id))
            {
                todo.Id = Guid.NewGuid().ToString();
            }

            // Save
            var cl = GetDatabaseClient();
            var sql = $"insert into [TODOS] (Id,State,Priority,Title,StartDate,EndDate,Memo,UserName) VALUES (@Id,@State,@Priority,@Title,@StartDate,@EndDate,@Memo,@UserName)";
            var p = new Dictionary<string, object>
            {
                { "Id", todo.Id },
                { "State", todo.State },
                { "Priority", todo.Priority },
                { "Title", todo.Title },
                { "StartDate", todo.StartDate },
                { "EndDate", todo.EndDate },
                { "Memo", todo.Memo },
                { "UserName", todo.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(todo.Id);
        }

        /// <summary>
        /// ToDoアイテムを更新します。
        /// </summary>
        /// <param name="todo"></param>
        /// <returns></returns>
        public TodosItem Update(TodosItem todo)
        {
            // Save
            var cl = GetDatabaseClient();
            var sql = $"update TODOS set Title = @Title, Memo = @Memo,State=@State,Priority=@Priority,StartDate=@StartDate,EndDate=@EndDate  where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", todo.Id },
                { "State", todo.State },
                { "Priority", todo.Priority },
                { "Title", todo.Title },
                { "StartDate", todo.StartDate },
                { "EndDate", todo.EndDate },
                { "Memo", todo.Memo },
                { "UserName", todo.UserName }
            };
            cl.ExecuteSql(sql, p);

            // Get
            return Get(todo.Id);
        }

        /// <summary>
        /// ToDoアイテムを削除します。
        /// </summary>
        /// <param name="todos"></param>
        /// <returns></returns>
        public void Delete(string id)
        {
            var cl = GetDatabaseClient();
            var sql = $"delete TODOS where Id = @Id";
            var p = new Dictionary<string, object>
            {
                { "Id", id }
            };
            cl.ExecuteSql(sql, p);
        }

        /// <summary>
        /// 全てのToDoアイテムを削除します。
        /// </summary>
        /// <param name="todo"></param>
        /// <returns></returns>
        public void Clear()
        {
            var cl = GetDatabaseClient();
            var sql = $"delete TODOS";
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