window.addEventListener('popstate', function (event) {
    const state = event.state;
    if (state && state.internal) {
        fetch(window.location.href, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cue-App-Request': 'true',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((html) => {
                const target = document.querySelector('#content');
                target.innerHTML = html;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
});
