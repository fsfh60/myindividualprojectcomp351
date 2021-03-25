const container = document.getElementById('FieldForm');
let totalQuestions = 1;

fetch('http://localhost:8888/', {
    method: 'GET',
}).then(response => response.json())
.then(data => {

    if (data.worked) {

        let records = Object.values(data.records);


        for (let x = 0; x < records.length; x++) {
            let firstwrapper = document.querySelectorAll('.question_wrapper')[0];
            const existingQuestion = records[x];

            console.log('existingQuestion', existingQuestion);

            if (x == 0) {
                populate(firstwrapper, existingQuestion);
            } else {

                // clone and add
                const template = cloneQuestion();

                populate(template, existingQuestion);
            }
        }
    }
});  


function populate(element, existingQuestion) {

    console.log('Questions are...', existingQuestion);

    element.setAttribute('data-question-id', existingQuestion.question_id);
    element.getElementsByTagName('textarea')[0].value = existingQuestion.title;
    element.querySelectorAll('input[name="question_id"]')[0] = existingQuestion.question_id || null;

    let radios = element.querySelectorAll('input[type="radio"]');
    const inputs = element.querySelectorAll('input[type="text"]');
    let inputIds = element.querySelectorAll('input[type="hidden"]');


    for (let y = 0; y < existingQuestion.options.length; y++) {

        inputs[y].value = existingQuestion.options[y].option;
        inputIds[y].value =existingQuestion.options[y].option_id;

        if (existingQuestion.options[y].is_correct) {
            radios[y].checked = true;
        }
    }
}



const addFieldButton = document.getElementById('add-field-button')
    .addEventListener('click', cloneQuestion);


function cloneQuestion() {

    totalQuestions++;

    const template = document.querySelectorAll('.question_wrapper')[0].cloneNode(true);
    template.setAttribute('data-question-id', null);

    let inputs = template.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }

    let textareas = template.getElementsByTagName('textarea');

    for (let i = 0; i < textareas.length; i++) {
        textareas[i].value = '';
    }

    let radios = template.querySelectorAll('input[type="radio"]');

    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
        radios[i].name = 'answer_' + totalQuestions;        
    }

    const removeButton = template.querySelector('.delete-field-button');
    removeButton.classList.remove('d-none')

    removeButton.addEventListener('click', function (ev) {

        let qWrapper = this.closest('.question_wrapper');
        let questionId = qWrapper.getAttribute('data-question-id');

        fetch('http://localhost:8888/' + questionId, {
            method: 'DELETE'
            //mode: 'no-cors'
        }).then(response => response.json())
        .then(data => {
            if (data.worked) {
                console.log('WORKED!!!');
                qWrapper.remove();
            }
        });  
    });

    container.appendChild(template);

    return template;
}

document.getElementById('save-field-button').addEventListener('click', function (e) {

    // get the specs from the user
    const questions = document.querySelectorAll('.question_wrapper');

    let existingData = [];

    for (let i = 0; i < questions.length; i++) {

        // for each question
        const question = questions[i];
        const qid = question.getAttribute('data-question-id');

        const radios = question.querySelectorAll('input[type="radio"]');
        const inputs = question.querySelectorAll('input[type="text"]');
        const inputIds = question.querySelectorAll('input[type="hidden"]');
        const questionId = question.querySelectorAll('input[name="question_id"]')[0].value || null;

        let q = {};
        q.title = question.getElementsByTagName('textarea')[0].value;
        q.question_id = questionId;
        q.options = [];

        for (let x = 0; x < inputs.length; x++) {

            q.options.push({
                text: inputs[x].value,
                option_id: inputIds[x].value || null,
                isCorrect: radios[x].checked,
                question_id: questionId
            });
        }

        existingData.push(q);
    }

        // Create POST Fetch to save the formData
        //localStorage.setItem('dynamicForm', JSON.stringify(formData));
    /*
    fetch('http://localhost:8888/', {
        method: 'POST',
        body: JSON.stringify(newData)
    }).then(response => response.json());  
    */

    fetch('http://localhost:8888/', {
        method: 'PUT',
        body: JSON.stringify(existingData)
    }).then(response => response.json())
      .then(data => {

        if(data.worked) {
            alert('Data Saved!');
            location.reload();
        } else 
        {
            alert('Something went south!');
        }

      });  

});
