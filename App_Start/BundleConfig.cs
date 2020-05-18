using System.Web;
using System.Web.Optimization;

namespace TaskManageMent
{
    public class BundleConfig
    {
        // バンドルの詳細については、https://go.microsoft.com/fwlink/?LinkId=301862 を参照してください
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 開発と学習には、Modernizr の開発バージョンを使用します。次に、実稼働の準備が
            // 運用の準備が完了したら、https://modernizr.com のビルド ツールを使用し、必要なテストのみを選択します。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/common.css"));

            bundles.Add(new StyleBundle("~/Content/homecss").Include(
                      "~/Content/Home/home.css",
                      "~/Content/common.css"));


            //calendar css
            bundles
               .Add(new StyleBundle("~/Content/calendarcss")
               .Include("~/Content/Todos/calendar.css"));

            //calendar js
            bundles
                .Add(new ScriptBundle("~/bundles/calendarjs")
                .Include("~/Scripts/Todos/calendar.js"));

            //todos js
            bundles
                .Add(new ScriptBundle("~/bundles/todosjs")
                .Include("~/Scripts/Todos/todos.js"));

            //todos css
            bundles
               .Add(new StyleBundle("~/Content/todoscss")
               .Include("~/Content/Todos/todos.css",
               "~/Content/reset.css",
                "~/Content/common.css"));

            //diaryjs
            bundles
               .Add(new ScriptBundle("~/bundles/diaryjs")
               .Include("~/Scripts/Todos/diary.js"));

            //diarycss
            bundles
                .Add(new StyleBundle("~/Content/diarycss")
                .Include("~/Content/Todos/diary.css",
                "~/Content/reset.css",
                "~/Content/common.css"));

            //address css
            bundles
                .Add(new StyleBundle("~/Content/addresscss")
                .Include("~/Content/Todos/address.css",
                "~/Content/reset.css",
                "~/Content/common.css"));

            //address js
            bundles
                .Add(new ScriptBundle("~/bundles/addressjs")
                .Include("~/Scripts/Todos/address.js"
                , "~/Content/Todos/calendar.css"));




        }
    }
}
