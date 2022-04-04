let server = "http://localhost:8000";

function postServiceData(method, params) {
    return fetch(server + "/" + method, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then((response) =>   
        response.json()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch (error => {
            console.log(error);
            return error;
        })
    );
}

export { postServiceData };