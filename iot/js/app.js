var useMongo = false;

var iotApp = angular.module('iotApp', ["highcharts-ng"]);

iotApp.controller('iotCtl', function ($scope, $http, $interval) {

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'line'
            },
            xAxis: {
                type: 'datetime',
                title : {text: 'Time (GMT)'},
                labels: {
                    enabled: true,
                    format: '{value:%H:%M}',
                    rotation: 45,
                    align: 'left'
                }
            },
            yAxis : {
                title : {text: 'Temperature'},
                labels: {
                    format: '{value} C'
                }
            }
        },
        series: [
            {
                name: 'T1',
                data: []
            },
            {
                name: 'T2',
                data: []
            },
            {
                name: 'T3',
                data: []
            }
        ],
        title: {
            text: 'Real Time Temperature Readings (last hour)'
        },
        loading: false
    };

    $scope.loadReportData = function() {

        var date60MinutesAgo, filter, svc, params, url, device, date;

        date60MinutesAgo = moment().subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        filter = "created_date >= :date";
        if (useMongo) {
            svc = "mongo";
            params = {
                "params": {
                    ":date": {
                        "$date": date60MinutesAgo
                    }
                }
            }
        } else {
            svc = "db";
            params = {
                "params": {
                    ":date": date60MinutesAgo
                }
            }
        }
        url = location.protocol + "//" + location.host + "/rest/" + svc + "/iot/";
        url += "?app_name=iot&method=GET&order=created_date asc&filter=" + filter;
        $http.post(url, params).then(
            function (res) {
                $scope.chartConfig.series.forEach(function (series) {
                    series.data = [];
                });
                res.data.record.forEach(function (record) {
                    if (record.created_date) {
                        device = record.device_id - 1;
                        if (device < $scope.chartConfig.series.length) {
                            if (useMongo) {
                                date = new Date(record.created_date.$date).getTime();
                            } else {
                                date = new Date(record.created_date).getTime();
                            }
                            $scope.chartConfig.series[device].data.push([date, record.temp]);
                        }
                    }
                });
            }
        );
    };

    $interval(function() {
        $scope.loadReportData();
    }, 5000);

    $scope.loadReportData();
});