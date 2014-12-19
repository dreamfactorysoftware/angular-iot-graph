var iotApp = angular.module('iotApp', ["highcharts-ng"])
    .controller(
    'iotController',
    function ($scope, $http, $interval) {
        Scope = $scope;
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'line'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis : {
                    title : {text: "Temperature"}
                }
            },
            series: [{
                name: '',

                data: [],
                pointInterval: 24 * 3600 * 100024 * 3600 * 1000
            }],
            title: {
                text: 'Real Time Temperature Readings'
            },

            loading: false
        };


        $scope.loadReports = function () {



            var date60SecondsAgo =   moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');;
            //date60SecondsAgo = new Date(date60SecondsAgo);
            $http.get("https://dsp-x.cloud.dreamfactory.com/rest/db/iot/?app_name=iot&filter=request_date>'" + date60SecondsAgo +"'").then(
                function (res) {
                    $scope.reportData = res.data.record;
                    $scope.chartConfig.series[0].data = [];
                    $scope.reportData.forEach(function(record){
                        //$scope.chartConfig.series[0].pointStart = date60SecondsAgo;
                        $scope.chartConfig.series[0].data.push([record.request_date,record.temp]);
                    })
                });




        };
        $interval(function(){
            $scope.loadReports();
        }, 5000);
        $scope.loadReports();
    });