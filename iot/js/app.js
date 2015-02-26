var iotApp = angular.module('iotApp', ["highcharts-ng"]);

iotApp.controller('iotCtl', function ($scope, $http, $interval) {

    // Credentials are not required here. You can also create a role and allow guest access.
    // But specifying credentials here is the easiest way to get the app up and running quickly.
    $scope.credentials = {
        username: 'your DSP admin email',
        password: 'your DSP password!'
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'line'
            },
            xAxis: {
                type: 'datetime',
                title : {text: 'Time'},
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

    $scope.loadReports = function() {

        var device, date;
        var date60MinutesAgo = moment().subtract(60, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        var url = location.protocol + "//" + location.host + "/rest/db/iot/";
        url += "?app_name=iot&filter=created_date>'" + date60MinutesAgo + "'";
        url += "&order=created_date asc";
        $http.get(url, {
            headers: { "Authorization": "Basic " + btoa($scope.credentials.username + ":" + $scope.credentials.password) }
        }).then(
            function(res) {
                $scope.chartConfig.series.forEach(function(series) {
                    series.data = [];
                });
                res.data.record.forEach(function(record) {
                    device = record.device_id - 1;
                    if (device < $scope.chartConfig.series.length) {
                        date = new Date(record.created_date);
                        $scope.chartConfig.series[device].data.push([date.getTime(), record.temp]);
                    }
                });
            }
        );
    };

    $interval(function() {
        $scope.loadReports();
    }, 5000);

    $scope.loadReports();
});