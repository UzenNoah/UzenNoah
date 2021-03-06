

MemberModule.factory('MemberService', function() {
	return {
		memberTemp : {
			id : 'noah1@noah.com',
			name : 'noah1',
			password : 'noah1',
			sex : 'm'
		}
	};
});

MemberModule.service('ValidationService', function($http, $log) {
	this.getValidInfoForVO = function(voName) {
		var promise = $http.get('/valid/' + voName).success(
				function(data, status, headers, config) {
					$log.log(data);
					validInfos = data;
					return validInfos;
				});
		return promise;
	};
	var validInfos = {};
});

MemberModule.controller('MemberRegisterController', [
		'$scope',
		'$http',
		'$location',
		'MemberService',
		'ValidationInformationFactory',
		'TEST_CONSTANT_LIST',
		function MemberRegisterController($scope, $http, $location,
				MemberService, ValidationInformationFactory,TEST_CONSTANT_LIST) {

			getValidInfo();
			function getValidInfo() {
				ValidationInformationFactory.getValidInfo(TEST_CONSTANT_LIST.TESTCONTROLLER_VALIDATION_TARGET_VO)
						.success(function(data) {
							$scope.valid = data;
						});
			}
			var memberTemp = MemberService.memberTemp;

			$scope.memberTemp = memberTemp;
			$scope.confirmPassword = '';

			$scope.onSubmit = function(myForm) {
				var dataObj = {
					id : memberTemp.id,
					name : memberTemp.name,
					password : memberTemp.password,
					sex : memberTemp.sex
				};

				if (myForm.$valid) {
					var res = $http.post('/factory/isExistID', dataObj);
					res.success(function(data, status, headers, config) {
						if (data.result) {
							alert("SUCCESS");
							memberTemp = dataObj;
							$location.path('/confirm');
						} else {
							alert("FAILED : Duplicate ID");
						}
					});
					res.error(function(data, status, headers, config) {
						// convert Object to String
						alert("failure message: Unknown Error"
								+ JSON.stringify({
									data : data
								}));
					});
				} else {
					alert("Plz Check your Form Data");
				}
			};

		} ]);
MemberModule.controller('MemberConfirmController', [ '$scope', '$http',
		'$window', '$location', 'MemberService',
		function($scope, $http, $window, $location, MemberService) {
			$scope.memberData = MemberService.memberTemp;
			$scope.register = function() {
				alert(JSON.stringify($scope.memberData));
				var res = $http.post('/factory/join', $scope.memberData);
				res.success(function(data, status, headers, config) {
					alert(data.resultMessage);
					if (data.result) {
						$window.location.href = "/member/confirm";
					}
				});
				res.error(function(data, status, headers, config) {
					// convert Object to String
					alert("failure message: Unknown Error" + JSON.stringify({
						data : data
					}));
				});
			};
			$scope.back = function() {
				$window.history.back();
			};
		} ]);

MemberModule.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/register', {
		templateUrl : '../static/js/controller/templates/memberRegister.html',
		controller : 'MemberRegisterController'
	}).when('/confirm', {
		templateUrl : '../static/js/controller/templates/memberConfirm.html',
		controller : 'MemberConfirmController'
	});
});
