var requestParameters = function() {
    return {
        redirect_uri: getParameterByName("redirect_uri"),
        client_id: getParameterByName("client_id"),
        code_challenge: getParameterByName("code_challenge"),
        code_challenge_method: getParameterByName("code_challenge_method"),
        page: page
    };
};