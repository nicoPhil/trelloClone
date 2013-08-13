window.tc = {};

window.tc.setInputPlaceholder = function() {

	function handleOneInput(thisInput) {
		var oldVal;
		if (!$.data(thisInput, 'hasHandler')) {
			console.log('adding stuff');
			$.data(thisInput, 'hasHandler', true);
			$(thisInput).focus(function() {
				oldVal = $(thisInput).val();
				$(thisInput).val('');
			}).blur(function() {
				setTimeout(function(){
					$(thisInput).val(oldVal);
				},250)
				
			});
		}
	}

	var i = 0;
	var inputArr = $("._placeholderChange");
	for (i = 0; i < inputArr.length; i++) {
		handleOneInput(inputArr[i]);
	}

}