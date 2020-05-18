using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace TaskManageMent.Data
{
    /// <summary>
    /// Sql ServerまたはAzure Sql Databaseに接続しSqlを実行する機能を提供します。
    /// </summary>
    public class SqlServerClient
    {
        /// <summary>
        /// 接続文字列を取得します。
        /// </summary>
        public string ConnectionString { get; }

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="connectionString"></param>
        public SqlServerClient(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        /// <summary>
        /// 指定したSQL文を実行し、データを取得します。
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public DataTable Select(string sql, Dictionary<string, object> parameters = null)
        {
            using (var cn = new SqlConnection(ConnectionString))
            using (var cmd = new SqlCommand(sql, cn))
            {
                SetParameters(cmd, parameters);

                using (var da = new SqlDataAdapter(cmd))
                using (var dt = new DataTable())
                {
                    da.Fill(dt);
                    return dt;
                }
            }
        }

        /// <summary>
        /// 指定したSQL文を実行します。
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public int ExecuteSql(string sql, Dictionary<string, object> parameters = null)
        {
            using (var cn = new SqlConnection(ConnectionString))
            using (var cmd = new SqlCommand(sql, cn))
            {
                SetParameters(cmd, parameters);

                cn.Open();
                return cmd.ExecuteNonQuery();
            }

        }

        /// <summary>
        /// SqlCommandにパラメータをセットします。
        /// </summary>
        /// <param name="cmd"></param>
        /// <param name="parameters"></param>
        private void SetParameters(SqlCommand cmd, Dictionary<string, object> parameters)
        {
            if (parameters != null)
            {
                foreach (var p in parameters)
                {
                    var value = p.Value;

                    // nullの場合はDBNullという特殊な値に置き換える
                    if (value == null)
                    {
                        value = DBNull.Value;
                    }

                    // パラメータを指定する場合は、@xxxという名前にする
                    cmd.Parameters.AddWithValue($"@{p.Key}", value);
                }
            }
        }
    }
}