// Authentication check - redirect to password page if not authenticated
(function() {
    if (sessionStorage.getItem('majen_authenticated') !== 'true') {
        window.location.href = 'password.html';
    }
})();
