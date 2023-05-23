const refs = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    gallery: document.querySelector('.gallery')
}

refs.form.addEventListener('submit', onInput)


function onInput(e) {
    e.preventDefault();
    const params = refs.input.value;
    console.log(params);
    return params;
}

function requestToBeckend(params) {
    return fetch('')
}