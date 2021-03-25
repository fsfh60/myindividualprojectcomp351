const container = document.getElementById('questionsContainer');
const submitForm = document.getElementById('submitForm');

submitForm.addEventListener('click', function (e) {
	let correctAnswerCounter = 0;
	let questions = container.getElementsByClassName('question_wrapper');
	//let result = [];
	for (let i = 0; i < questions.length; i++) {
		let question = questions[i];
		let radios = question.querySelectorAll('input[type="radio"]');

		for (let x = 0; x < radios.length; x++) {
			let radio = radios[x];
			let wrapper = radio.closest('.form-check');
			wrapper.style.backgroundColor = 'transparent';
			if (radio.checked) {

				if (radio.getAttribute('data-is-correct') == '1') {
					correctAnswerCounter++;
					wrapper.style.backgroundColor = 'green';
				} else {
					wrapper.style.backgroundColor = 'red';
                }
            }
        }
	}
	/*
	let answers = JSON.parse(localStorage.getItem('answers') || '[]') || [];
	answers.push(result);
	localStorage.setItem('answers', JSON.stringify(answers));
	*/

	
	alert('Thank you for your answers. your score is ' + ((correctAnswerCounter / questions.length) * 100) + '%');
});

//let existingQuestions = JSON.parse(localStorage.getItem('dynamicForm') || '[]');

fetch('http://localhost:8888/', {
    method: 'GET',
    headers: {
       // 'Content-Type': 'application/json'
    }//,
    //body: JSON.stringify(form)
}).then(response => response.json())
.then(data => {

    if (data.worked) {

    	let records = Object.values(data.records);

		for (let x = 0; x < records.length; x++)
		{
			let existingQuestion = records[x];

			const name = 'answer_' + x;
			console.log('adding...', existingQuestion);
			//console.log(existingQuestion.options);
			let htmlCode = getHtmlCode(existingQuestion.title, existingQuestion.options, name);
			

			container.innerHTML += htmlCode;
			
		}

    }
});  




function getHtmlCode(title, options, name) {

	let code = '<div class="question_wrapper"> ' +
		'<h2 class="question-title-holder">' + title + '</h2>';

	for (let i = 0; i < options.length; i++) {

		code += '<div class="form-check">';
		code += '<input class="form-check-input" type="radio" name="' + name + '" data-is-correct="' + options[i].is_correct + '" data-text="' + options[i].option +'" />';
		code += '<label class="form-check-label">'+options[i].option +'</label>';
		code += '</div>';
    }

	code += '</div>'
	return code;
}
