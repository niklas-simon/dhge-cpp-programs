var state = 0;
var VERIFY_EMAIL = 1;
var SIGNIN = 2;
var AFA = 3;
var OPTIONAL_EMAIL_VERIFICATION = 4;
var captchaStatusToken = "";
var csrf = "";
var sessionId = "";
var possessionChallengeOtpToken = "";
var optionalEmailVerificationToken = "";
var optionalVerificationMethodConfirmationToken = "";
var otpGuess = "";
var skipEmailVerification = false;
var u2fResponse = "";
var skipU2FValidation = false;
var mfaSerial = "";
var u2fMfaSerial = "";
var mfaResponse = "";
var candidateMfaResponse = "";
var bypassCaptcha = false;
var handleCandidateU2fLogin;
var rootLoginMfaType = "";
var mfaTypeList = "";
var captcha_script_ele_id = "captcha_script";
var isFingerprintFileLoadedMetricReportedSuccessfully = false;
var isFingerprintGeneratedMetricReportedSuccessfully = false;
var isWebauthnCompatible = isBrowserWebAuthnCompatible();

function profileFingerprintForm(formName) {
    if (document.getElementById(formName)) {
        fwcim.profile(formName);
    }
}

function reportFingerprintFileLoadedMetric(userOperation) {
    var metricName;
    var metricValue;
    var metricOperation = FINGERPRINT_METRICS_OPERATION_PREFIX;
    var metricPath = FINGERPRINT_METRICS_PATH;
    try {
        metricOperation = metricOperation + ":" + userOperation;
        metricValue = fwcim ? "1" : "Fingerprint file was not loaded during operation: " + userOperation;
    } catch (err) {
        metricValue = err;
    } finally {
        if (!isFingerprintFileLoadedMetricReportedSuccessfully) {
            metricName = metricValue === "1" ? IS_FINGERPRINT_FILE_LOADED_SUCCESS : IS_FINGERPRINT_FILE_LOADED_FAILURE;
            reportMetric(metricName, metricValue, metricOperation, metricPath);
            isFingerprintFileLoadedMetricReportedSuccessfully = (metricName === IS_FINGERPRINT_FILE_LOADED_SUCCESS);
        }
    }
}

function reportFingerprintGeneratedMetric(metricName, metricValue, userOperation) {
    const metricOperation = FINGERPRINT_METRICS_OPERATION_PREFIX + ":" + userOperation;
    if (!isFingerprintGeneratedMetricReportedSuccessfully) {
        reportMetric(metricName, metricValue, metricOperation, FINGERPRINT_METRICS_PATH);
        isFingerprintGeneratedMetricReportedSuccessfully = (metricName === IS_FINGERPRINT_GENERATED_SUCCESS);
    }
}

function getMetadata(userOperation, reportMetadata) {
    try {
        profileFingerprintForm("fpr_form");
        fwcim.report(".fwcim-form", function(err, metadata) {
            if (!err) {
                reportMetadata(metadata);
                reportFingerprintGeneratedMetric(IS_FINGERPRINT_GENERATED_SUCCESS, metadata, userOperation);
            } else {
                reportMetadata(null);
                reportFingerprintGeneratedMetric(IS_FINGERPRINT_GENERATED_FAILURE, err, userOperation);
            }
        });
    } catch (err) {
        reportMetadata(null);
        reportFingerprintGeneratedMetric(IS_FINGERPRINT_GENERATED_FAILURE, err, userOperation);
    }
}
var errorMessageController = (function() {
    var show = function(title, message) {
        $("#error_title").html(title);
        $("#error_message_description").html(message);
        $("#error_message").show();
    };
    var hide = function() {
        $("#error_message").hide();
        $("#error_title").text("");
        $("#error_message_description").text("");
    };
    return {
        show: show,
        hide: hide
    };
})();
var otpErrorMessageController = (function() {
    var show = function(title, message) {
        $("#otp_error_title").html(title);
        $("#otp_error_message_description").html(message);
        $("#otp_error_message").show();
    };
    var hide = function() {
        $("#otp_error_message").hide();
        $("#otp_error_title").text("");
        $("#otp_error_message_description").text("");
    };
    return {
        show: show,
        hide: hide
    };
})();
var otpSuccessMessageController = (function() {
    var show = function(title, message) {
        $("#otp_success_title").html(title);
        $("#otp_success_message_description").html(message);
        $("#otp_success_message").show();
    };
    var hide = function() {
        $("#otp_success_message").hide();
        $("#otp_success_title").text("");
        $("#otp_success_message_description").text("");
    };
    return {
        show: show,
        hide: hide
    };
})();
var u2fMfaController = (function() {
    var show = function(mode) {
        if (mode === "candidate") {
            $("#troubleshoot_u2f_mfa").hide();
            $("#candidate_troubleshoot_u2f_mfa").show();
            $("#cancel_u2f_mfa").hide();
            $("#cancel_candidate_u2f_mfa").show();
        } else {
            $("#troubleshoot_u2f_mfa").show();
            $("#candidate_troubleshoot_u2f_mfa").hide();
            $("#cancel_u2f_mfa").show();
            $("#cancel_candidate_u2f_mfa").hide();
        }
        $("#u2f_container").show();
    };
    var hide = function() {
        $("#u2f_container").hide();
        $("#troubleshoot_u2f_mfa").hide();
        $("#candidate_troubleshoot_u2f_mfa").hide();
    };
    return {
        show: show,
        hide: hide
    };
})();
var resolverContainerController = (function(mobile) {
    var show = function() {
        if (mobile) {
            $("#new_account_container").hide();
        }
        $("#resolver_container").show();
        $("#resolving_input").focus();
    };
    var hide = function() {
        $("#resolver_container").hide();
    };
    var showResolvingInputWarning = function(warningMessage) {
        $("#resolving_input").addClass("error");
        $("#resolving_input_alert").show();
        $("#resolving_account_input_alert_content").html(warningMessage);
    };
    var hideResolvingInputWarning = function() {
        $("#resolving_input").removeClass("error");
        $("#resolving_input_alert").hide();
    };
    var showSpinnerOnNextButtonAndDisableTheButton = function() {
        $("#next_button").addClass("aws-signin-button-disabled");
        $("#next_button").attr("disabled", "disabled");
        $("#next_button_text").addClass("aws-signin-spinner-white");
    };
    var removeSpinnerOnNextButtonAndEnableTheButton = function() {
        $("#next_button_text").removeClass().addClass("aws-signin-color-white");
        $("#next_button").removeAttr("disabled");
        $("#next_button").removeClass("aws-signin-button-disabled");
    };
    var init = function() {
        $("#resolving_input").on("input", function() {
            hideResolvingInputWarning();
        });
        $("#resolving_input").on("propertychange input", function() {
            hideResolvingInputWarning();
        });
        $("#resolving_input").keypress(function(e) {
            var key = e.which;
            if (key == 13) {
                resolveIdentifier();
            }
        });
        $("#next_button").click(function() {
            resolveIdentifier();
        });
        $("#create_aws_account").click(function() {
            window.location = signupUrl;
        });
    };
    return {
        show: show,
        hide: hide,
        showResolvingInputWarning: showResolvingInputWarning,
        hideResolvingInputWarning: hideResolvingInputWarning,
        showSpinnerOnNextButtonAndDisableTheButton: showSpinnerOnNextButtonAndDisableTheButton,
        removeSpinnerOnNextButtonAndEnableTheButton: removeSpinnerOnNextButtonAndEnableTheButton,
        init: init
    };
})(isMobileApp);
var loginContainerController = (function(mobile, isReAuth) {
    var show = function() {
        if (mobile) {
            $("#root_forgot_password_link").hide();
            $("#create_a_new_account_link").hide();
        }
        if (isReAuth) {
            $(".change_account_link").hide();
        }
        $("#login_container").show();
    };
    var hide = function() {
        $("#login_container").hide();
    };
    var showPasswordInputWarning = function(message) {
        $("#password").addClass("error");
        $("#password_input_alert_content").html(message);
        $("#password_input_alert").show();
    };
    var hidePasswordInputWarning = function() {
        $("#password").removeClass("error");
        $("#password_input_alert").hide();
    };
    return {
        show: show,
        hide: hide,
        showPasswordInputWarning: showPasswordInputWarning,
        hidePasswordInputWarning: hidePasswordInputWarning
    };
})(isMobileApp, isAccountUpdateReAuth);
var candidateLoginContainerController = (function(mobile, isReAuth) {
    var show = function() {
        if (isReAuth) {
            $(".change_account_link").hide();
        }
        $("#candidate_login_container").show();
    };
    var hide = function() {
        $("#candidate_login_container").hide();
    };
    var showPasswordInputWarning = function(message) {
        $("#candidate_password").addClass("error");
        $("#password_input_alert_content_v2").html(message);
        $("#candidate_password_input_alert").show();
    };
    var hidePasswordInputWarning = function() {
        $("#candidate_password").removeClass("error");
        $("#candidate_password_input_alert").hide();
    };
    var showSpinnerOnCandidateSigninButtonAndDisableTheButton = function() {
        $("#candidate_signin_button").addClass("aws-signin-button-disabled");
        $("#candidate_signin_button").attr("disabled", "disabled");
        $("#candidate_signin_button_text").addClass("aws-signin-spinner-white");
    };
    var hideSpinnerOnCandidateSigninButtonAndEnableTheButton = function() {
        $("#candidate_signin_button_text").removeClass().addClass("aws-signin-color-white");
        $("#candidate_signin_button").removeAttr("disabled");
        $("#candidate_signin_button").removeClass("aws-signin-button-disabled");
    };
    return {
        show: show,
        hide: hide,
        showPasswordInputWarning: showPasswordInputWarning,
        hidePasswordInputWarning: hidePasswordInputWarning,
        showSpinnerOnCandidateSigninButtonAndDisableTheButton: showSpinnerOnCandidateSigninButtonAndDisableTheButton,
        hideSpinnerOnCandidateSigninButtonAndEnableTheButton: hideSpinnerOnCandidateSigninButtonAndEnableTheButton
    };
})(isMobileApp, isAccountUpdateReAuth);
var candidateMfaContainer = (function() {
    var show = function(candidateEmail) {
        $("#candidate_mfaCode").removeClass("error");
        $("#candidate_mfaCode_input_alert").hide();
        $("#candidate_mfa_email_label").text(candidateEmail);
        $("#candidate_mfa_container").show();
        $("#candidate_mfaCode").focus();
    };
    var hide = function() {
        $("#candidate_mfaCode").val("");
        $("#candidate_mfa_container").hide();
    };
    var showMfaInputWarning = function(message) {
        $("#candidate_mfaCode").addClass("error");
        $("#candidate_mfaCode_input_alert").show();
    };
    var hideMfaInputWarning = function() {
        $("#candidate_mfaCode").removeClass("error");
        $("#candidate_mfaCode_input_alert").hide();
    };
    var showSpinnerOnCandidateMfaSigninButtonAndDisableTheButton = function() {
        $("#candidate_mfa_submit_button").addClass("aws-signin-button-disabled");
        $("#candidate_mfa_submit_button").attr("disabled", "disabled");
        $("#candidate_mfa_submit_button_text").addClass("aws-signin-spinner-white");
    };
    var hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton = function() {
        $("#candidate_mfa_submit_button_text").removeClass().addClass("aws-signin-color-white");
        $("#candidate_mfa_submit_button").removeAttr("disabled");
        $("#candidate_mfa_submit_button").removeClass("aws-signin-button-disabled");
    };
    return {
        show: show,
        hide: hide,
        showMfaInputWarning: showMfaInputWarning,
        hideMfaInputWarning: hideMfaInputWarning,
        showSpinnerOnCandidateMfaSigninButtonAndDisableTheButton: showSpinnerOnCandidateMfaSigninButtonAndDisableTheButton,
        hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton: hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton
    };
})();
$(function() {
    csrf = $("meta[name=csrf_token]").attr("content");
    sessionId = $("meta[name=session_id]").attr("content");
    var params = new requestParameters();
    var page = params.page;
    if ("resolve" !== page) {
        var accountInfo = getCookie("aws-signin-account-info");
        if (accountInfo !== "") {
            accountInfo = JSON.parse(decodeURIComponent(accountInfo));
            if ("1" === accountInfo.accountType) {
                showPasswordEntry(accountInfo.email);
            }
        }
    }
    if (showErrorMessage) {
        errorMessageController.show(errorTitle, errorMessage);
    }
    resolverContainerController.init();
    if (isInvalidSignupLoginUrl) {
        showBookmarkedUrlMessageDiv();
    }
    var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
    if (passwordRecoveryAudioCaptcha) {
        passwordRecoveryAudioCaptcha.onended = function() {
            $("#password_recovery_pause_audio_captcha").hide();
            $("#password_recovery_play_audio_captcha").show();
        };
    }
    var authenticationAudioCaptcha = document.getElementById("audio_captcha");
    if (authenticationAudioCaptcha) {
        authenticationAudioCaptcha.onended = function() {
            $("#pause_audio_captcha").hide();
            $("#play_audio_captcha").show();
        };
    }
    var submitCaptcha = function() {
        hideErrors();
        var audioCaptchaElement = document.getElementById("audio_captcha");
        if (audioCaptchaElement != null && audioCaptchaElement.src != null && audioCaptchaElement.src !== "") {
            audioCaptchaElement.pause();
            $("#pause_audio_captcha").hide();
            $("#play_audio_captcha").show();
        }
        var captchaGuess = $("#captchaGuess").val().trim();
        if (captchaGuess === "") {
            $("#captchaGuess_input_alert").show();
            $("#captchaGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text error");
        } else {
            if (state == VERIFY_EMAIL) {
                resolveAccountType(true);
            } else {
                if (state == AFA) {
                    afaLogin(true);
                } else {
                    var mfaCode1 = $("#resync_mfa_code1").val().trim();
                    var mfaCode2 = $("#resync_mfa_code1").val().trim();
                    var isResync = mfaCode1.length > 0 && mfaCode2.length > 0;
                    signin(isResync);
                }
            }
        }
    };
    $("#captchaGuess").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            submitCaptcha();
        }
    });
    $("#submit_captcha").click(function() {
        submitCaptcha();
    });
    $("#captchaGuess").on("input", function() {
        $("#captchaGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text");
        $("#captchaGuess_input_alert").hide();
    });
    $("#captchaGuess").on("propertychange input", function() {
        $("#captchaGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text");
        $("#captchaGuess_input_alert").hide();
    });
    $("#optional_verification_method_confirmation_verify_email").click(function() {
        getMetadata(CONFIRM_OPTIONAL_VERIFICATION_METHOD, function(metadata1) {
            try {
                var params = new requestParameters();
                var redirectURI = params.redirect_uri;
                var clientId = params.client_id;
                var email = $("#email").val();
                var data = {
                    action: "confirmOptionalVerificationMethod",
                    email: email,
                    redirect_uri: redirectURI,
                    client_id: clientId,
                    csrf: csrf,
                    sessionId: sessionId,
                    metadata1: metadata1,
                    selectedVerificationMethod: "EmailVerification"
                };
                if (typeof optionalVerificationMethodConfirmationToken != "undefined" && optionalVerificationMethodConfirmationToken.length > 0) {
                    data.optionalVerificationMethodConfirmationToken = optionalVerificationMethodConfirmationToken;
                }
                optionalVerificationMethodConfirmationContainerController.requestInProgress();
                $.post("/signin", data, function(data, status) {
                    optionalVerificationMethodConfirmationContainerController.requestFinished();
                    optionalVerificationMethodConfirmationContainerController.clean();
                    hideErrors();
                    hideSigninInnerFullWidthContainer();
                    showMarketingContainer();
                    showSigninInnerContainer();
                    clearCaptchaState();
                    clearMfaUserInput();
                    otpContainerController.clean();
                    var state = data.state;
                    if ("SUCCESS" === state && data.properties.OptionalEmailVerification === "true") {
                        showOTP(email, data);
                        window.resendOtpTimer = setInterval(setResendOtpTimer(60), 1000);
                    } else {
                        showPasswordEntry(email);
                        errorMessageController.show(data.properties.Title, data.properties.Message);
                    }
                }).fail(function(xhr) {
                    hideSigninInnerFullWidthContainer();
                    showMarketingContainer();
                    showSigninInnerContainer();
                    handleAjaxCallFailure(xhr);
                });
            } catch (err) {}
        });
    });
    $("#optional_verification_method_confirmation_skip_verification_link").click(function() {
        skipEmailVerification = true;
        hideErrors();
        signin(false);
    });
    var submitOTP = function() {
        hideErrors();
        otpGuess = $("#otpGuess").val().trim();
        if (isOTPGuessFormationCorrect(otpGuess)) {
            showSpinnerOnOTPButtonAndDisableTheButton();
            signin(false);
        } else {
            $("#otpGuess_input_alert").show();
            $("#otpGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text error");
        }
    };
    var isOTPGuessFormationCorrect = function(otpGuess) {
        if (otpGuess.length !== 6) {
            return false;
        }
        if (!/^\d+$/.test(otpGuess)) {
            return false;
        }
        return true;
    };
    $("#otpGuess").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            submitOTP();
        }
    });
    $("#submit_otp").click(function() {
        submitOTP();
    });
    $("#otpGuess").on("input", function() {
        $("#otpGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text");
        $("#otpGuess_input_alert").hide();
    });
    $("#otpGuess").on("propertychange input", function() {
        $("#otpGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text");
        $("#otpGuess_input_alert").hide();
    });
    var sendResendOtpRequest = function() {
        hideErrors();
        var email = $("#email").val();
        handleResendOtp(email);
    };
    $("#resend_otp_button_text").click(function() {
        sendResendOtpRequest();
    });
    $("#otp_skip_verification_link").click(function() {
        skipEmailVerification = true;
        hideErrors();
        showSpinnerOnOTPButtonAndDisableTheButton();
        signin(false);
    });
    var refreshCaptcha = function() {
        var captchaToken = $("#captchaToken").val();
        var captchaObfuscationToken = $("#captchaObfuscationToken").val();
        var email = $("#captchaEmail").val();
        $.ajax({
            type: "POST",
            url: "/signin",
            data: {
                action: "captcha",
                csrf: csrf,
                sessionId: sessionId,
                email: email,
                captcha_token: captchaToken,
                captchaObfuscationToken: captchaObfuscationToken
            }
        }).done(function(data) {
            clearCaptchaState();
            if ("SUCCESS" === data.state) {
                populateCaptcha(data.properties.CES, data.properties.CaptchaURL, data.properties.captchaObfuscationToken, data.properties.email);
                $("#audio_captcha_div").hide();
                $("#image_captcha_div").show();
                $("#captchaGuess").focus();
            }
        }).fail(function(xhr) {
            handleAjaxCallFailure(xhr);
        });
    };
    $("#refresh_captcha").click(function() {
        refreshCaptcha();
    });
    var refreshAudioCaptcha = function() {
        var captchaToken = $("#captchaToken").val();
        var captchaObfuscationToken = $("#captchaObfuscationToken").val();
        var email = $("#captchaEmail").val();
        $.ajax({
            type: "POST",
            url: "/signin",
            data: {
                action: "captcha",
                csrf: csrf,
                sessionId: sessionId,
                email: email,
                captcha_token: captchaToken,
                captchaObfuscationToken: captchaObfuscationToken,
                captchaType: "AUDIO"
            }
        }).done(function(data) {
            clearCaptchaState();
            if ("SUCCESS" === data.state) {
                populateAudioCaptcha(data.properties.CES, data.properties.CaptchaURL, data.properties.captchaObfuscationToken, data.properties.email);
                $("#image_captcha_div").hide();
                $("#audio_captcha_div").show();
                $("#captchaGuess").focus();
            }
        }).fail(function(xhr) {
            handleAjaxCallFailure(xhr);
        });
    };
    $("#switch_to_audio_captcha").click(function() {
        refreshAudioCaptcha();
    });
    $("#play_audio_captcha").click(function() {
        var audioCaptchaElement = document.getElementById("audio_captcha");
        if (audioCaptchaElement != null && audioCaptchaElement.src != null && audioCaptchaElement.src !== "") {
            audioCaptchaElement.play();
            $("#play_audio_captcha").hide();
            $("#pause_audio_captcha").show();
        }
    });
    $("#replay_audio_captcha").click(function() {
        var audioCaptchaElement = document.getElementById("audio_captcha");
        if (audioCaptchaElement != null && audioCaptchaElement.src != null && audioCaptchaElement.src !== "") {
            audioCaptchaElement.pause();
            audioCaptchaElement.currentTime = 0;
            audioCaptchaElement.play();
            $("#play_audio_captcha").hide();
            $("#pause_audio_captcha").show();
        }
    });
    $("#pause_audio_captcha").click(function() {
        var audioCaptchaElement = document.getElementById("audio_captcha");
        if (audioCaptchaElement != null && audioCaptchaElement.src != null && audioCaptchaElement.src !== "") {
            audioCaptchaElement.pause();
            $("#pause_audio_captcha").hide();
            $("#play_audio_captcha").show();
        }
    });
    $("#switch_to_image_captcha").click(function() {
        var audioCaptchaElement = document.getElementById("audio_captcha");
        if (audioCaptchaElement != null && audioCaptchaElement.src != null && audioCaptchaElement.src !== "") {
            audioCaptchaElement.pause();
        }
        refreshCaptcha();
    });
    $("#refresh_audio_captcha").click(function() {
        refreshAudioCaptcha();
    });
    $("#root_forgot_password_link").click(function() {
        handleForgotPasswordFlow(false, "CLASSIC_IMAGE");
    });
    $("#candidate_root_forgot_password_link").click(function() {
        var email = $("#candidate_email").val();
        window.location = authPortalForgotPasswordUrl + "&email=" + encodeURIComponent(email);
    });
    $(".change_account_link").click(function() {
        otpContainerController.clean();
        hideAllContainers();
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        $("#resolving_input").val("");
        resolverContainerController.show();
    });
    $("#quicksight_switch_account").click(function() {
        window.location = quickSightSwitchAccountUrl;
    });
    $("#otp_maximum_attempt_reached").click(function() {
        otpContainerController.clean();
        hideAllContainers();
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        $("#resolving_input").val("");
        resolverContainerController.show();
    });
    $("#create_a_new_account_link").click(function() {
        window.location = signupUrl;
    });
    $("#password").on("input", function() {
        loginContainerController.hidePasswordInputWarning();
    });
    $("#password").on("propertychange input", function() {
        loginContainerController.hidePasswordInputWarning();
    });
    var signinOperation = function() {
        var params = new requestParameters();
        var redirectURI = params.redirect_uri;
        var password = $("#password").val();
        var selectedMfaOption = $("input[name='multiMfaOption']:checked").val();
        var rememberMfa = "";
        var rememberMfaCheckbox = document.getElementById("remember_mfa_checkbox");
        if (rememberMfaCheckbox) {
            rememberMfa = rememberMfaCheckbox.checked;
        }
        if (password === "") {
            setTimeout(function() {
                loginContainerController.showPasswordInputWarning(loginpage_logindiv_password_empty);
            }, 200);
            return false;
        }
        showSpinnerOnSigninButtonAndDisableTheButton();
        var email = $("#email").val().trim();
        rootLoginMfaType = "";
        mfaTypeList = "";
        $.ajax({
            type: "POST",
            url: "/mfa",
            data: {
                email: email,
                redirect_uri: redirectURI,
                csrf: csrf,
                sessionId: sessionId,
                selectedMfaOption: selectedMfaOption,
                rememberMfa: rememberMfa,
                password: password
            }
        }).done(function(data) {
            mfaResponse = $.parseJSON(data);
            var mfaType = mfaResponse.mfaType;
            var displayHeaderMessage = mfaResponse.displayHeaderMessage;
            var displayTextMessage = mfaResponse.displayTextMessage;
            var problems = mfaResponse.problems;
            mfaSerial = mfaResponse.mfaSerial;
            rootLoginMfaType = mfaType;
            mfaTypeList = mfaResponse.mfaTypeList;
            if (mfaType == "HW" || mfaType == "SW" || mfaType == "SWHW") {
                removeSpinnerOnSigninButtonAndEnableTheButton();
                showMfaEntry();
            } else {
                if (mfaType == "U2F" && mfaResponse.u2FRequestData && mfaResponse.u2FRequestData.webauthnEnabled) {
                    removeSpinnerOnSigninButtonAndEnableTheButton();
                    showWebAuthnMfa(mfaResponse.u2FRequestData.appId, mfaResponse.u2FRequestData.rpId, mfaResponse.u2FRequestData.challenge, mfaResponse.u2FRequestData.registeredKeys);
                } else {
                    if (mfaType == "U2F") {
                        removeSpinnerOnSigninButtonAndEnableTheButton();
                        showU2fMfa(mfaResponse.u2FRequestData.appId, mfaResponse.u2FRequestData.challenge, mfaResponse.u2FRequestData.registeredKeys);
                    } else {
                        if (mfaType === "MULTI") {
                            removeSpinnerOnSigninButtonAndEnableTheButton();
                            showMultiMfaEntry();
                        } else {
                            if (problems != null) {
                                removeSpinnerOnSigninButtonAndEnableTheButton();
                                errorMessageController.show(problems.main, problems.main);
                            } else {
                                signin();
                            }
                        }
                    }
                }
            }
        }).fail(function(xhr) {
            removeSpinnerOnSigninButtonAndEnableTheButton();
            handleAjaxCallFailure(xhr);
        });
        reportFingerprintFileLoadedMetric(SIGN_IN);
    };
    $("#password").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            signinOperation();
        }
    });
    $("#signin_button").click(function() {
        hideErrors();
        signinOperation();
    });
    $("#multi_mfa_next_button").click(function() {
        hideErrors();
        showMarketingContainer();
        var selectedMfaOption = $("input[name='multiMfaOption']:checked").val();
        if (selectedMfaOption) {
            if (selectedMfaOption === "U2F") {
                signinOperation();
            } else {
                if (selectedMfaOption === "SWHW") {
                    rootLoginMfaType = "SWHW";
                    showMfaEntry();
                }
            }
        }
    });
    $("#afa_login_button").click(function() {
        afaLogin(false);
    });
    var afaLogin = function(captcha) {
        getMetadata(AFA_LOGIN, function(metadata1) {
            try {
                afaLoginWithMetaData(captcha, metadata1);
            } catch (err) {}
        });
    };
    var afaLoginWithMetaData = function(captcha, metadata) {
        showSpinnerOnAfaButtonAndDisableTheButton();
        var email = $("#email").val().trim();
        var password = $("#password").val();
        var captchaToken = $("#captchaToken").val();
        var captchaGuess = $("#captchaGuess").val();
        var captchaObfuscationToken = $("#captchaObfuscationToken").val();
        var data = {
            action: "decoupledAfaLogin",
            email: email,
            password: password,
            metadata1: metadata
        };
        if (typeof captchaToken != "undefined" && captchaToken.length > 0 && captcha == true) {
            data.captcha_token = captchaToken;
        }
        if (typeof captchaGuess != "undefined" && captchaGuess.length > 0 && captcha == true) {
            data.captcha_guess = captchaGuess;
        }
        if (typeof captchaStatusToken != "undefined" && captchaStatusToken.length > 0) {
            data.captcha_status_token = captchaStatusToken;
            captchaStatusToken = "";
        }
        if (typeof captchaObfuscationToken != "undefined" && captchaObfuscationToken.length > 0 && captcha == true) {
            data.captchaObfuscationToken = captchaObfuscationToken;
        }
        $.ajax({
            type: "POST",
            url: "/noMfa",
            data: data
        }).done(function(data) {
            removeSpinnerOnAfaButtonAndEnableTheButton();
            clearCaptchaState();
            var state = data.state;
            var email = $("#email").val();
            if ("FAIL" === state) {
                hideSigninInnerFullWidthContainer();
                showMarketingContainer();
                showSigninInnerContainer();
                if (data.properties.Captcha === "true") {
                    captchaStatusToken = "";
                    showCaptcha(data.properties.CES, data.properties.CaptchaURL, AFA, true, data.properties.captchaObfuscationToken, email, data.properties.CaptchaType);
                } else {
                    clearMfaUserInput();
                    showPasswordEntry(email);
                    errorMessageController.show(data.properties.Title, data.properties.Message);
                }
            } else {
                if (data.properties.Captcha === "true") {
                    captchaStatusToken = "";
                    hideSigninInnerFullWidthContainer();
                    showMarketingContainer();
                    showSigninInnerContainer();
                    showCaptcha(data.properties.CES, data.properties.CaptchaURL, AFA, false, data.properties.captchaObfuscationToken, email, data.properties.CaptchaType);
                } else {
                    window.location = data.properties.redirectTo;
                }
            }
        }).fail(function(xhr) {
            clearCaptchaState();
            hideSigninInnerFullWidthContainer();
            showMarketingContainer();
            showSigninInnerContainer();
            removeSpinnerOnAfaButtonAndEnableTheButton();
        });
    };
    $("#mfaCode").on("input", function() {
        $("#mfaCode").removeClass("error");
        $("#mfaCode_input_alert").hide();
    });
    $("#mfaCode").on("propertychange input", function() {
        $("#mfaCode").removeClass("error");
        $("#mfaCode_input_alert").hide();
    });
    $("#troubleshoot_mfa").click(function() {
        showMfaDeviceConfirmation();
    });
    $("#troubleshoot_u2f_mfa").click(function() {
        skipU2FValidation = true;
        showMfaDeviceConfirmation("U2F");
    });
    $("#candidate_troubleshoot_u2f_mfa").click(function() {
        var email = $("#candidate_email").val();
        window.location = authPortalTroubleshootMfaUrl + "&email=" + encodeURIComponent(email);
    });
    $("#swhw_mfa_try_another_mfa_method").click(function() {
        rootLoginMfaType = "MULTI";
        showMultiMfaEntry();
    });
    $("#u2f_mfa_try_another_mfa_method").click(function() {
        rootLoginMfaType = "MULTI";
        showMultiMfaEntry();
    });
    $("#cancel_mfa").click(function() {
        mfaTypeList = "";
        clearMfaUserInput();
        var email = $("#email").val();
        showPasswordEntry(email);
    });
    $("#cancel_u2f_mfa").click(function() {
        $("#password").val("");
        $("#email").val("");
        $("#resolving_input").val("");
        skipU2FValidation = true;
        mfaSerial = "";
        u2fResponse = "";
        mfaTypeList = "";
        showResolverContainer();
    });
    $("#cancel_candidate_u2f_mfa").click(function() {
        $("#candidate_password").val("");
        $("#candidate_email").val("");
        $("#resolving_input").val("");
        skipU2FValidation = true;
        u2fMfaSerial = "";
        u2fResponse = "";
        candidateMfaResponse = "";
        showResolverContainer();
        reportMetric(CANDIDATE_MFA_CANCEL, "CandidateU2FCancel", CANDIDATE_ROOT_LOGIN, CANDIDATE_METRICS_PATH);
    });
    $("#cancel_multi_mfa").click(function() {
        mfaTypeList = "";
        rootLoginMfaType = "";
        clearMfaUserInput();
        var email = $("#email").val();
        showPasswordEntry(email);
        showMarketingContainer();
    });
    var submitMfa = function(e) {
        $("#mfaCode").removeClass("error");
        $("#mfaCode_input_alert").hide();
        var mfacode = $("#mfaCode").val().trim();
        if (mfacode === "") {
            setTimeout(function() {
                $("#mfaCode").addClass("error");
                $("#mfaCode_input_alert").show();
            }, 200);
            return false;
        } else {
            showSpinnerOnMfaSubmitButtonAndDisableTheButton();
            signin();
        }
    };
    $("#mfaCode").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            submitMfa();
        }
    });
    $("#mfa_submit_button").click(function() {
        submitMfa();
    });
    $("#resync_mfa").click(function() {
        showResyncMfa();
    });
    $("#mfa_device_confirmation").click(function() {
        var mfaDeviceAvailable = $("input[name=mfa_device_available]:checked").val();
        if ("yes" === mfaDeviceAvailable) {
            showResyncMfa();
        } else {
            showMfaCustomerSupport();
        }
    });
    $("#cancel_mfa_device_confirm_link").click(function() {
        clearMfaUserInput();
        showMfaEntry();
    });
    $("#candidate_cancel_mfa").click(function() {
        clearMfaUserInput();
        var email = $("#candidate_email").val();
        reportMetric(CANDIDATE_MFA_CANCEL, "CandidateMFACancel", CANDIDATE_ROOT_LOGIN, CANDIDATE_METRICS_PATH);
        showCandidatePasswordEntry(email);
    });
    $("#candidate_troubleshoot_mfa").click(function() {
        var email = $("#candidate_email").val();
        window.location = authPortalTroubleshootMfaUrl + "&email=" + encodeURIComponent(email);
    });
    $("#contact_mfa_customer_service_button").click(function() {
        window.location = contactUsMfaUrl;
    });
    $("#contact_premium_support").click(function() {
        window.location = contactPremiumSupportUrl;
    });
    $("#cancel_customer_support").click(function() {
        showMfaDeviceConfirmation();
    });
    $("#resync_mfa_code1").on("input", function() {
        $("#resync_mfa_code1").removeClass("error");
        $("#resync_mfa_code1_input_alert").hide();
    });
    $("#resync_mfa_code1").on("propertychange input", function() {
        $("#resync_mfa_code1").removeClass("error");
        $("#resync_mfa_code1_input_alert").hide();
    });
    $("#resync_mfa_code2").on("input", function() {
        $("#resync_mfa_code2").removeClass("error");
        $("#resync_mfa_code2_input_alert").hide();
    });
    $("#resync_mfa_code2").on("propertychange input", function() {
        $("#resync_mfa_code2").removeClass("error");
        $("#resync_mfa_code2_input_alert").hide();
    });
    $("#cancel_mfa_resync").click(function() {
        clearMfaUserInput();
        showMfaDeviceConfirmation();
    });
    var resyncMfa = function() {
        var mfacode1 = $("#resync_mfa_code1").val().trim();
        var mfacode2 = $("#resync_mfa_code2").val().trim();
        if (mfacode1 === "") {
            $("#resync_mfa_code1").removeClass("error");
            $("#resync_mfa_code1_input_alert").hide();
            $("#resync_mfa_code1").val("");
            setTimeout(function() {
                $("#resync_mfa_code1").addClass("error");
                $("#resync_mfa_code1_input_alert").show();
            }, 200);
            return false;
        } else {
            if (mfacode2 === "") {
                $("#resync_mfa_code2").removeClass("error");
                $("#resync_mfa_code2_input_alert").hide();
                $("#resync_mfa_code2").val("");
                setTimeout(function() {
                    $("#resync_mfa_code2").addClass("error");
                    $("#resync_mfa_code2_input_alert").show();
                }, 200);
                return false;
            } else {
                showSpinnerOnResyncMfaButtonAndDisableTheButton();
                signin(true);
            }
        }
    };
    $("#resync_mfa_button").click(function() {
        resyncMfa();
    });
    $("#resync_mfa_code1").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            $("#resync_mfa_code2").focus();
        }
    });
    $("#resync_mfa_code2").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            resyncMfa();
        }
    });
    $("#password_recovery_refresh_captcha").click(function() {
        $("#password_recovery_error_message").hide();
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captcha_guess").val("");
        $("#password_recovery_captchaGuess_input_alert").hide();
        $.ajax({
            type: "POST",
            url: "/signin",
            data: {
                action: "captcha",
                forgotpassword: "true",
                csrf: csrf,
                sessionId: sessionId
            }
        }).done(function(data) {
            if ("SUCCESS" === data.state) {
                populatePasswordRecoveryCaptcha(data.properties.CES, data.properties.CaptchaURL, data.properties.captchaObfuscationToken);
            }
        }).fail(function(xhr) {
            if (xhr.status >= 400 && xhr.status <= 499) {
                showForgotPasswordPopupError(general_error_bad_request_title, general_error_bad_request_message);
            }
            if (xhr.status >= 500 && xhr.status <= 599) {
                showForgotPasswordPopupError(general_error_internal_server_error_title, general_error_internal_server_error_message);
            }
        });
    });
    $("#password_recovery_captcha_guess").on("input", function() {
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captchaGuess_input_alert").hide();
    });
    $("#password_recovery_captcha_guess").on("propertychange input", function() {
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captchaGuess_input_alert").hide();
    });
    $("#password_recovery_switch_to_audio_captcha").click(function() {
        $("#password_recovery_error_message").hide();
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captcha_guess").val("");
        $("#password_recovery_captchaGuess_input_alert").hide();
        $("#password_recovery_image_captcha_div").hide();
        $("#password_recovery_audio_captcha_div").show();
        refreshForgotPasswordAudioCaptcha();
    });
    $("#password_recovery_refresh_audio_captcha").click(function() {
        $("#password_recovery_error_message").hide();
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captcha_guess").val("");
        $("#password_recovery_captchaGuess_input_alert").hide();
        refreshForgotPasswordAudioCaptcha();
    });
    $("#password_recovery_switch_to_image_captcha").click(function() {
        $("#password_recovery_error_message").hide();
        $("#password_recovery_captcha_guess").removeClass("error");
        $("#password_recovery_captcha_guess").val("");
        $("#password_recovery_captchaGuess_input_alert").hide();
        $("#password_recovery_audio_captcha_div").hide();
        $("#password_recovery_image_captcha_div").show();
        refreshForgotPasswordCaptcha();
    });
    $("#password_recovery_play_audio_captcha").click(function() {
        var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
        if (passwordRecoveryAudioCaptcha != null && passwordRecoveryAudioCaptcha.src != null && passwordRecoveryAudioCaptcha.src !== "") {
            passwordRecoveryAudioCaptcha.play();
            $("#password_recovery_play_audio_captcha").hide();
            $("#password_recovery_pause_audio_captcha").show();
        }
    });
    $("#password_recovery_replay_audio_captcha").click(function() {
        var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
        if (passwordRecoveryAudioCaptcha != null && passwordRecoveryAudioCaptcha.src != null && passwordRecoveryAudioCaptcha.src !== "") {
            passwordRecoveryAudioCaptcha.pause();
            passwordRecoveryAudioCaptcha.currentTime = 0;
            passwordRecoveryAudioCaptcha.play();
            $("#password_recovery_play_audio_captcha").hide();
            $("#password_recovery_pause_audio_captcha").show();
        }
    });
    $("#password_recovery_pause_audio_captcha").click(function() {
        var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
        if (passwordRecoveryAudioCaptcha != null && passwordRecoveryAudioCaptcha.src != null && passwordRecoveryAudioCaptcha.src !== "") {
            passwordRecoveryAudioCaptcha.pause();
            $("#password_recovery_pause_audio_captcha").hide();
            $("#password_recovery_play_audio_captcha").show();
        }
    });
    var sendResetPasswordRequest = function() {
        var recoveryEmail = $("#password_recovery_email").val().trim();
        var captchaToken = $("#password_recovery_captcha_token").val();
        var captchaGuess = $("#password_recovery_captcha_guess").val();
        if (captchaGuess === "") {
            $("#password_recovery_captcha_guess").addClass("error");
            $("#password_recovery_captchaGuess_input_alert").show();
        } else {
            handleGetResetPasswordToken(recoveryEmail, captchaToken, captchaGuess);
        }
    };
    $("#password_recovery_captcha_guess").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            sendResetPasswordRequest();
        }
    });
    $("#password_recovery_ok_button").click(function() {
        if (bypassCaptcha) {
            var email = $("#email").val().trim();
            handleGetResetPasswordToken(email, "", "");
        } else {
            sendResetPasswordRequest();
        }
    });
    $("#password_recovery_cancel_button").click(function() {
        dismissForgotPasswordPopup();
    });
    $("#password_recovery_done_button").click(function() {
        dismissForgotPasswordPopup();
    });
    $("#password_recovery_dismiss_button").click(function() {
        dismissForgotPasswordPopup();
    });
    $("#candidate_signin_button").click(function() {
        hideErrors();
        candidateSigninOperation();
    });
    $("#candidate_password").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            hideErrors();
            candidateSigninOperation();
        }
    });
    $("#candidate_mfa_submit_button").click(function() {
        submitCandidateMfa();
    });
    $("#candidate_mfaCode").keypress(function(e) {
        var key = e.which;
        if (key == 13) {
            submitCandidateMfa();
        }
    });
    var submitCandidateMfa = function(e) {
        $("#candidate_mfaCode").removeClass("error");
        $("#candidate_mfaCode_input_alert").hide();
        var mfacode = $("#candidate_mfaCode").val().trim();
        if (mfacode === "") {
            setTimeout(function() {
                $("#candidate_mfaCode").addClass("error");
                $("#candidate_mfaCode_input_alert").show();
            }, 200);
            return false;
        } else {
            candidateMfaContainer.showSpinnerOnCandidateMfaSigninButtonAndDisableTheButton();
            candidateSigninOperation();
        }
    };

    function showCandidateU2fMfa(appId, challenge, registeredKeys) {
        hideAllContainers();
        u2fMfaController.show("candidate");
        skipU2FValidation = false;
        if (isU2FCompatible == COMPATIBLE) {
            $("#u2f_incompatible").hide();
            try {
                u2f.sign(appId, challenge, registeredKeys, handleCandidateU2fData, 120);
            } catch (err) {
                reportMetric(U2F_CLIENT_LIBRARY_ERROR, err.message, U2F_CANDIDATE_COUPLED_ROOT, U2F_METRICS_PATH);
            }
        } else {
            $("#u2f_compatible").hide();
            candidateMfaResponse = "";
        }
    }

    function showCandidateWebAuthnMfa(appId, rpId, challenge, registeredKeys) {
        hideAllContainers();
        u2fMfaController.show("candidate");
        skipU2FValidation = false;
        if (isWebauthnCompatible === COMPATIBLE) {
            $("#u2f_incompatible").hide();
            var webAuthnData = prepareWebAuthnData(appId, rpId, challenge, registeredKeys);
            navigator.credentials.get(webAuthnData).then(handleCandidateWebAuthnData, handlCandidateWebAuthnError);
        } else {
            $("#u2f_compatible").hide();
            mfaResponse = "";
        }
    }

    function handleCandidateU2fData(signResponse) {
        if (skipU2FValidation) {
            return;
        }
        if (signResponse.errorCode) {
            reportMetric(U2F_ERROR_CODE, signResponse.errorCode, U2F_CANDIDATE_COUPLED_ROOT, U2F_METRICS_PATH);
            clearMfaUserInput();
            var email = $("#candidate_email").val();
            showCandidatePasswordEntry(email);
            errorMessageController.show(general_authenticate_error_title, general_authenticate_error_message);
        } else {
            u2fResponse = signResponse;
            candidateSignin();
        }
    }

    function handleCandidateWebAuthnData(signResponse) {
        if (skipU2FValidation) {
            return;
        }
        u2fResponse = signResponse;
        candidateSignin(true);
    }

    function handlCandidateWebAuthnError(errorResp) {
        reportMetric(U2F_CLIENT_LIBRARY_ERROR, errorResp, U2F_CANDIDATE_COUPLED_ROOT, U2F_METRICS_PATH);
    }
    handleCandidateU2fLogin = handleCandidateU2fData;
    var candidateSigninOperation = function() {
        var params = new requestParameters();
        var redirectURI = params.redirect_uri;
        var password = $("#candidate_password").val();
        if (password === "") {
            setTimeout(function() {
                candidateLoginContainerController.showPasswordInputWarning(loginpage_logindiv_password_empty);
            }, 200);
            return false;
        }
        candidateSignin();
    };

    function candidateSignin(isWebAuthn) {
        getMetadata(CANDIDATE_SIGN_IN, function(metadata1) {
            try {
                candidateSigninWithMetadata(metadata1, isWebAuthn);
            } catch (err) {}
        });
    }

    function candidateSigninWithMetadata(metadata1, isWebAuthn) {
        var params = new requestParameters();
        var codeChallenge = params.code_challenge;
        var codeChallengeMethod = params.code_challenge_method;
        var redirectURI = params.redirect_uri;
        var clientId = params.client_id;
        var password = $("#candidate_password").val();
        var email = $("#candidate_email").val();
        var mfacode1 = $("#candidate_mfaCode").val();
        var data = {
            action: "authenticateCandidate",
            email: email,
            password: password,
            redirect_uri: redirectURI,
            client_id: clientId,
            csrf: csrf,
            sessionId: sessionId,
            metadata1: metadata1
        };
        if (typeof mfacode1 != "undefined" && mfacode1.trim().length > 0) {
            data.mfaType = "OTP";
            data.mfa1 = mfacode1;
        }
        if (typeof codeChallenge != "undefined" && codeChallenge != null && typeof codeChallengeMethod != "undefined" && codeChallengeMethod != null) {
            if (codeChallenge.length > 0 && codeChallengeMethod.length > 0) {
                data.code_challenge = codeChallenge;
                data.code_challenge_method = codeChallengeMethod;
            }
        }
        if (isWebAuthn) {
            setWebAuthnSignResponse(data, u2fMfaSerial);
        } else {
            setU2FSignResponse(data, u2fMfaSerial);
        }
        candidateLoginContainerController.showSpinnerOnCandidateSigninButtonAndDisableTheButton();
        candidateMfaResponse = "";
        $.post("/signin", data, function(data, status) {
            hideSigninInnerFullWidthContainer();
            showMarketingContainer();
            showSigninInnerContainer();
            clearCaptchaState();
            var state = data.state;
            var actionInAjaxResponse = data.properties.Action;
            if ("FAIL" === state) {
                removeSpinnerOnSigninButtonAndEnableTheButton();
                candidateMfaContainer.hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton();
                u2fResponse = "";
                u2fMfaSerial = "";
                if ("Suspended" === data.properties.AuthenticationFailureType) {
                    showSuspendedUserDiv(data.properties.AccountState, data.properties.MsgType);
                } else {
                    if ("Redirect" === actionInAjaxResponse) {
                        window.location = data.properties.RedirectTo;
                    } else {
                        candidateLoginContainerController.hideSpinnerOnCandidateSigninButtonAndEnableTheButton();
                        if ("Bad Request" === data.properties.Title) {
                            $("#resolver_container").show();
                            $("#resolving_input").addClass("error");
                            showResolverContainer();
                        } else {
                            showCandidatePasswordEntry(email);
                        }
                        errorMessageController.show(data.properties.Title, data.properties.Message);
                    }
                }
            } else {
                if ("SUCCESS" === state) {
                    if ("MFA" === actionInAjaxResponse) {
                        candidateLoginContainerController.hideSpinnerOnCandidateSigninButtonAndEnableTheButton();
                        if ("HW" === data.properties.MfaType || "SW" === data.properties.MfaType) {
                            showCandidateMfaEntry();
                        }
                        if ("U2F" === data.properties.MfaType && data.properties.U2fRequestData && data.properties.U2fRequestData.webauthnEnabled) {
                            candidateMfaResponse = data.properties;
                            u2fMfaSerial = data.properties.U2FSerialNumber;
                            removeSpinnerOnSigninButtonAndEnableTheButton();
                            showCandidateWebAuthnMfa(data.properties.U2fRequestData.appId, data.properties.U2fRequestData.rpId, data.properties.U2fRequestData.challenge, data.properties.U2fRequestData.registeredKeys);
                        }
                        if ("U2F" === data.properties.MfaType) {
                            candidateMfaResponse = data.properties;
                            u2fMfaSerial = data.properties.U2FSerialNumber;
                            removeSpinnerOnSigninButtonAndEnableTheButton();
                            showCandidateU2fMfa(data.properties.U2fRequestData.appId, data.properties.U2fRequestData.challenge, data.properties.U2fRequestData.registeredKeys);
                        }
                    } else {
                        if ("Redirect" === actionInAjaxResponse) {
                            window.location = data.properties.RedirectTo;
                        }
                    }
                }
            }
        }).fail(function(xhr) {
            u2fResponse = "";
            u2fMfaSerial = "";
            hideSigninInnerFullWidthContainer();
            showMarketingContainer();
            showSigninInnerContainer();
            removeSpinnerOnSigninButtonAndEnableTheButton();
            candidateMfaContainer.hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton();
            removeSpinnerOnResyncMfaButtonAndEnableTheButton();
            removeSpinnerOnOTPButtonAndEnableTheButton();
            candidateLoginContainerController.hideSpinnerOnCandidateSigninButtonAndEnableTheButton();
            handleAjaxCallFailure(xhr);
        });
    }
    $("#aws-signin-general-user-selection").on("click", ".aws-signin-radio-border", function(e) {
        e.currentTarget.getElementsByClassName("aws-signin-radio")[0].checked = true;
        updateResolveAccountDescriptionFromRadioButton();
    });
    var rootButton = document.getElementById("root_user_radio_button");
    var iamButton = document.getElementById("iam_user_radio_button");
    if (iamButton.checked) {
        document.getElementById("resolving_input_label").innerHTML = loginpage_resolveaccountdiv_input_label_iam;
        document.getElementById("aws-signin-general-user-selection-iam").className = "aws-signin-radio-border aws-signin-radio-selection";
        document.getElementById("aws-signin-general-user-selection-root").className = "aws-signin-radio-border";
        document.getElementById("resolving_input").placeholder = "";
    } else {
        document.getElementById("resolving_input_label").innerHTML = loginpage_resolveaccountdiv_input_label_root;
        document.getElementById("aws-signin-general-user-selection-root").className = "aws-signin-radio-border aws-signin-radio-selection";
        document.getElementById("aws-signin-general-user-selection-iam").className = "aws-signin-radio-border";
        document.getElementById("resolving_input").placeholder = loginpage_resolveaccountdiv_input_placeholder;
    }
    reportFingerprintFileLoadedMetric(ON_LOAD);
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function resolveIdentifier() {
    var identifier = $("#resolving_input").val().trim();
    hideErrors();
    if (identifier === "") {
        setTimeout(function() {
            resolverContainerController.showResolvingInputWarning(loginpage_resolveaccountdiv_warning_empty);
        }, 200);
    } else {
        if (identifier.indexOf("@") != -1) {
            var emailPattern = /^.{1,}@.{1,}\..{1,}/;
            if (identifier.match(emailPattern)) {
                resolverContainerController.showSpinnerOnNextButtonAndDisableTheButton();
                resolveAccountType(false);
            } else {
                resolverContainerController.showResolvingInputWarning(loginpage_resolveaccountdiv_warning_invalid);
            }
        } else {
            resolverContainerController.showSpinnerOnNextButtonAndDisableTheButton();
            showIamSignin(identifier);
        }
    }
    reportFingerprintFileLoadedMetric(RESOLVE_ACCOUNT);
}

function resolveAccountType(captcha) {
    getMetadata(RESOLVE_ACCOUNT, function(metadata1) {
        try {
            resolveAccountTypeWithMetadata(captcha, metadata1);
        } catch (err) {}
    });
}

function resolveAccountTypeWithMetadata(captcha, metadata1) {
    var params = new requestParameters();
    var redirectURI = params.redirect_uri;
    var resolvingEmail = $("#resolving_input").val().trim();
    var captchaToken = $("#captchaToken").val();
    var captchaGuess = $("#captchaGuess").val();
    var captchaObfuscationToken = $("#captchaObfuscationToken").val();
    var data = {
        action: "resolveAccountType",
        redirect_uri: redirectURI,
        email: resolvingEmail,
        metadata1: metadata1,
        csrf: csrf,
        sessionId: sessionId
    };
    if (typeof captchaToken != "undefined" && captchaToken.length > 0 && captcha == true) {
        data.captcha_token = captchaToken;
    }
    if (typeof captchaGuess != "undefined" && captchaGuess.length > 0 && captcha == true) {
        data.captcha_guess = captchaGuess;
    }
    if (typeof captchaObfuscationToken != "undefined" && captchaObfuscationToken.length > 0 && captcha == true) {
        data.captchaObfuscationToken = captchaObfuscationToken;
    }
    $.ajax({
        type: "POST",
        url: "/signin",
        data: data
    }).done(function(data) {
        clearCaptchaState();
        if (data.state === "SUCCESS") {
            if (data.properties.resolvedAccountType == "Coupled") {
                window.location = authPortalUrl + "&awsEmail=" + encodeURIComponent(resolvingEmail);
            } else {
                if (data.properties.resolvedAccountType == "PostDecouple") {
                    window.location = authPortalPostDecoupleUrl + "&awsEmail=" + encodeURIComponent(resolvingEmail);
                } else {
                    if (data.properties.resolvedAccountType == "Candidate") {
                        if (isMobileApp) {
                            window.location = authPortalUrl + "&awsEmail=" + encodeURIComponent(resolvingEmail);
                        } else {
                            resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
                            showCandidatePasswordEntry(resolvingEmail);
                        }
                    } else {
                        if (data.properties.resolvedAccountType == "Decoupled") {
                            captchaStatusToken = data.properties.captchaStatusToken;
                            resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
                            showPasswordEntry(resolvingEmail);
                        } else {
                            if (data.properties.resolvedAccountType == "Unknown") {
                                resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
                                hideAllContainers();
                                $("#resolver_container").show();
                                $("#resolving_input").addClass("error");
                                showResolverContainer();
                                errorMessageController.show(loginpage_error_title_unknownaccount, loginpage_error_message_unknownaccount);
                            } else {
                                if (data.properties.resolvedAccountType == "PrivateLinkNotSupported") {
                                    resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
                                    errorMessageController.show(private_link_unsupported_tile, private_link_unsupported_message);
                                } else {
                                    if (data.properties.Captcha === "true") {
                                        showCaptcha(data.properties.CES, data.properties.CaptchaURL, VERIFY_EMAIL, false, data.properties.captchaObfuscationToken, resolvingEmail, data.properties.CaptchaType);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
            if (data.properties.Captcha === "true") {
                showCaptcha(data.properties.CES, data.properties.CaptchaURL, VERIFY_EMAIL, true, data.properties.captchaObfuscationToken, resolvingEmail, data.properties.CaptchaType);
            } else {
                showResolverContainer();
                errorMessageController.show(data.properties.Title, data.properties.Message);
            }
        }
    }).fail(function(xhr) {
        clearCaptchaState();
        resolverContainerController.removeSpinnerOnNextButtonAndEnableTheButton();
        handleAjaxCallFailure(xhr);
    });
}

function updateResolveAccountDescriptionFromRadioButton() {
    var rootButton = document.getElementById("root_user_radio_button");
    var iamButton = document.getElementById("iam_user_radio_button");
    if (iamButton.checked) {
        document.getElementById("resolving_input_label").innerHTML = loginpage_resolveaccountdiv_input_label_iam;
        document.getElementById("aws-signin-general-user-selection-iam").className = "aws-signin-radio-border aws-signin-radio-selection";
        document.getElementById("aws-signin-general-user-selection-root").className = "aws-signin-radio-border";
        document.getElementById("resolving_input").placeholder = "";
    } else {
        document.getElementById("resolving_input_label").innerHTML = loginpage_resolveaccountdiv_input_label_root;
        document.getElementById("aws-signin-general-user-selection-root").className = "aws-signin-radio-border aws-signin-radio-selection";
        document.getElementById("aws-signin-general-user-selection-iam").className = "aws-signin-radio-border";
        document.getElementById("resolving_input").placeholder = loginpage_resolveaccountdiv_input_placeholder;
    }
}

function clearCaptchaState() {
    $("#captchaToken").val("");
    $("#captchaGuess").val("");
    $("#captchaObfuscationToken").val("");
    hideCaptchaImageAndCanvas();
}

function clearMfaUserInput() {
    u2fResponse = "";
    mfaResponse = "";
    candidateMfaResponse = "";
    $("#mfaCode").val("");
    $("#resync_mfa_code1").val("");
    $("#resync_mfa_code2").val("");
    $("#candidate_mfaCode").val("");
    $('input[name="mfa_device_available"]').prop("checked", false);
    $('input[name="multiMfaOption"]').prop("checked", false);
}

function hideAllContainers() {
    loginContainerController.hide();
    candidateLoginContainerController.hide();
    candidateMfaContainer.hide();
    errorMessageController.hide();
    otpErrorMessageController.hide();
    otpSuccessMessageController.hide();
    u2fMfaController.hide();
    optionalVerificationMethodConfirmationContainerController.hide();
    $(".signin-container").each(function() {
        $(this).hide();
    });
    $(".signin-container-1").each(function() {
        $(this).hide();
    });
    hideErrors();
}

function hideMarketingContainer() {
    $("#marketing_container").hide();
}

function hideSigninInnerContainer() {
    document.getElementById("signin_inner_container").style.display = "none";
}

function hideSigninInnerFullWidthContainer() {
    document.getElementById("signin_inner_full_width_container").style.display = "none";
}

function showMarketingContainer() {
    $("#marketing_container").show();
}

function showSigninInnerContainer() {
    document.getElementById("signin_inner_container").style.display = "block";
}

function showSigninInnerFullWidthContainer() {
    document.getElementById("signin_inner_full_width_container").style.display = "block";
}

function hideErrors() {
    errorMessageController.hide();
    otpErrorMessageController.hide();
    otpSuccessMessageController.hide();
    $("#captcha_error_message").hide();
    $("input").removeClass("error");
    $(".signin-input-warning").each(function() {
        $(this).hide();
    });
}

function setResendOtpTimer(time) {
    clearInterval(window.resendOtpTimer);
    $("#resend_otp_button_text").text(loginpage_otpdiv_resend_button_text + " (" + time + ")");
    $("#resend_otp_button_text").addClass("aws-signin-link-disabled");
    return function() {
        if (time === 0) {
            clearInterval(window.resendOtpTimer);
            $("#resend_otp_button_text").text(loginpage_otpdiv_resend_button_text);
            $("#resend_otp_button_text").removeClass("aws-signin-link-disabled");
        } else {
            time = time - 1;
            $("#resend_otp_button_text").text(loginpage_otpdiv_resend_button_text + " (" + time + ")");
        }
    };
}

function disableResendButton() {
    $("#resend_otp_button_text").addClass("aws-signin-link-disabled");
}

function enableResendButton() {
    $("#resend_otp_button_text").removeClass("aws-signin-link-disabled");
}

function showSpinnerOnSigninButtonAndDisableTheButton() {
    $("#signin_button").addClass("aws-signin-button-disabled");
    $("#signin_button").attr("disabled", "disabled");
    $("#signin_button_text").addClass("aws-signin-spinner-white");
}

function removeSpinnerOnSigninButtonAndEnableTheButton() {
    $("#signin_button_text").removeClass();
    $("#signin_button").removeAttr("disabled");
    $("#signin_button").removeClass("aws-signin-button-disabled");
}

function showSpinnerOnMfaSubmitButtonAndDisableTheButton() {
    $("#mfa_submit_button").addClass("aws-signin-button-disabled");
    $("#mfa_submit_button").attr("disabled", "disabled");
    $("#mfa_submit_button_text").addClass("aws-signin-spinner-white");
}

function removeSpinnerOnMfaSubmitButtonAndEnableTheButton() {
    $("#mfa_submit_button_text").removeClass();
    $("#mfa_submit_button").removeAttr("disabled");
    $("#mfa_submit_button").removeClass("aws-signin-button-disabled");
}

function showSpinnerOnResyncMfaButtonAndDisableTheButton() {
    $("#resync_mfa_button").addClass("aws-signin-button-disabled");
    $("#resync_mfa_button").attr("disabled", "disabled");
    $("#resync_mfa_button_text").addClass("aws-signin-spinner-white");
}

function removeSpinnerOnResyncMfaButtonAndEnableTheButton() {
    $("#resync_mfa_button_text").removeClass();
    $("#resync_mfa_button").removeAttr("disabled");
    $("#resync_mfa_button").removeClass("aws-signin-button-disabled");
}

function showSpinnerOnAfaButtonAndDisableTheButton() {
    $("#afa_login_button").addClass("aws-signin-button-disabled");
    $("#afa_login_button").attr("disabled", "disabled");
    $("#afa_button_text").addClass("aws-signin-spinner-white");
}

function removeSpinnerOnAfaButtonAndEnableTheButton() {
    $("#afa_button_text").removeClass();
    $("#afa_login_button").removeAttr("disabled");
    $("#afa_login_button").removeClass("aws-signin-button-disabled");
}

function showSpinnerOnOTPButtonAndDisableTheButton() {
    $("#submit_otp").addClass("aws-signin-button-disabled");
    $("#submit_otp").attr("disabled", "disabled");
    $("#otp_button_text").addClass("aws-signin-spinner-white");
}

function removeSpinnerOnOTPButtonAndEnableTheButton() {
    $("#otp_button_text").removeClass();
    $("#submit_otp").removeAttr("disabled");
    $("#submit_otp").removeClass("aws-signin-button-disabled");
}

function DisableOTPButton() {
    $("#submit_otp").addClass("aws-signin-button-disabled");
    $("#submit_otp").attr("disabled", "disabled");
}

function EnableOTPButton() {
    $("#otp_button_text").removeClass();
    $("#submit_otp").removeAttr("disabled");
    $("#submit_otp").removeClass("aws-signin-button-disabled");
}

function showIamSignin(account) {
    var iamRedirect = iamLoginUrl + "&account=" + account;
    var params = new requestParameters();
    var codeChallenge = params.code_challenge;
    var codeChallengeMethod = params.code_challenge_method;
    if (codeChallenge && codeChallengeMethod) {
        iamRedirect = iamRedirect + "&code_challenge=" + codeChallenge + "&code_challenge_method=" + codeChallengeMethod;
    }
    window.location = iamRedirect;
}

function showMfaDeviceConfirmation(mfaType) {
    hideAllContainers();
    hideMarketingContainer();
    hideSigninInnerContainer();
    showSigninInnerFullWidthContainer();
    $("#mfa_device_confirm_container").show();
    if (mfaType == "U2F") {
        $("#aws-signin-troubleshoot-mfa-resync").hide();
        $("#aws-signin-troubleshoot-mfa-resync-hr").hide();
    }
}

function showResyncMfa() {
    hideAllContainers();
    $("#resync_mfa_code1").val("");
    $("#resync_mfa_code2").val("");
    $("#resync_mfa_container").show();
    $("#resync_mfa_code1").focus();
}

function showResolverContainer() {
    hideAllContainers();
    resolverContainerController.show();
}

function showPasswordEntry(email) {
    hideAllContainers();
    mfaTypeList = "";
    $('input[name="multiMfaOption"]').prop("checked", false);
    $("#email_label").text(email);
    $("#email").val(email);
    $("#resolving_input_alert").hide();
    errorMessageController.hide();
    $("#resolving_input").removeClass("error");
    $("#resolver_container").hide();
    loginContainerController.show();
    $("#password").val("");
    $("#password").focus();
    usePasswordManagerCredentials();
}

function usePasswordManagerCredentials() {
    if (typeof isSignInPasswordManagerEnabled == "undefined" || !isSignInPasswordManagerEnabled) {
        return;
    }
    const loginHint = getParameterByName("login_hint");
    const forceMobileApp = getParameterByName("forceMobileApp");
    if (!loginHint || forceMobileApp != "1") {
        return;
    }
    navigator.credentials.get({
        password: true
    }).then(function(credential) {
        if (credential) {
            if (loginHint == credential.id) {
                $("#password").val(credential.password);
                $("#signin_button").click();
            } else {
                errorMessageController.show(loginpage_captchadiv_passwordmanager_wrong_title, loginpage_captchadiv_passwordmanager_wrong.replace("%s", loginHint));
            }
        }
    });
}

function showMfaEntry() {
    hideAllContainers();
    clearMfaUserInput();
    $("#mfa_email_label").text($("#email").val());
    if (mfaTypeList !== undefined && mfaTypeList !== "") {
        $("#swhw_mfa_try_another_mfa_method_box").show();
    } else {
        $("#swhw_mfa_try_another_mfa_method_box").hide();
    }
    $("#mfa_container").show();
    $("#mfaCode").focus();
}

function showMultiMfaEntry() {
    hideAllContainers();
    clearMfaUserInput();
    $("#multi_mfa_webauthn_radio_button_box").hide();
    $("#multi_mfa_swhw_radio_button_box").hide();
    for (var i = 0; i < mfaTypeList.length; i++) {
        if (mfaTypeList[i] === "U2F") {
            $("#multi_mfa_webauthn_radio_button_box").show();
        }
        if (mfaTypeList[i] === "SW" || mfaTypeList[i] === "HW" || mfaTypeList[i] === "SWHW") {
            $("#multi_mfa_swhw_radio_button_box").show();
        }
    }
    $("#multi_mfa_container").show();
    $("#marketing_container").hide();
}

function stringToBase64Url(enc) {
    var str = atob(enc.replace(/_/g, "/").replace(/-/g, "+"));
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function base64UrlToString(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=*$/, "");
}

function showU2fMfa(appId, challenge, registeredKeys) {
    hideAllContainers();
    if (mfaTypeList !== undefined && mfaTypeList !== "") {
        $("#u2f_mfa_try_another_mfa_method").show();
    } else {
        $("#u2f_mfa_try_another_mfa_method").hide();
    }
    u2fMfaController.show("decoupled");
    skipU2FValidation = false;
    if (isU2FCompatible == COMPATIBLE) {
        $("#u2f_incompatible").hide();
        try {
            u2f.sign(appId, challenge, registeredKeys, handleU2fData, 120);
        } catch (err) {
            reportMetric(U2F_CLIENT_LIBRARY_ERROR, err.message, U2F_DECOUPLED_ROOT, U2F_METRICS_PATH);
        }
    } else {
        $("#u2f_compatible").hide();
        mfaResponse = "";
    }
}

function showWebAuthnMfa(appId, rpId, challenge, registeredKeys) {
    hideAllContainers();
    if (mfaTypeList !== undefined && mfaTypeList !== "") {
        $("#u2f_mfa_try_another_mfa_method").show();
    } else {
        $("#u2f_mfa_try_another_mfa_method").hide();
    }
    u2fMfaController.show("decoupled");
    skipU2FValidation = false;
    if (isWebauthnCompatible === COMPATIBLE) {
        $("#u2f_incompatible").hide();
        var webAuthnData = prepareWebAuthnData(appId, rpId, challenge, registeredKeys);
        navigator.credentials.get(webAuthnData).then(handleWebAuthnData, handleWebAuthnError);
    } else {
        $("#u2f_compatible").hide();
        mfaResponse = "";
    }
}

function prepareWebAuthnData(appId, rpId, challenge, registeredKeys) {
    var allowCredentialsArr = [];
    for (var i = 0; i < registeredKeys.length; i++) {
        allowCredentialsArr.push({
            "id": stringToBase64Url(registeredKeys[i].keyHandle),
            "type": "public-key"
        });
    }
    var webAuthnData = {
        publicKey: {
            "challenge": stringToBase64Url(challenge),
            "rpId": rpId,
            "allowCredentials": allowCredentialsArr,
            "extensions": {
                "appid": appId
            },
            "userVerification": "discouraged"
        }
    };
    return webAuthnData;
}

function handleU2fData(signResponse) {
    if (skipU2FValidation) {
        return;
    }
    u2fResponse = signResponse;
    signin();
}

function handleWebAuthnData(signResponse) {
    if (skipU2FValidation) {
        return;
    }
    u2fResponse = signResponse;
    signin(false, true);
}

function handleWebAuthnError(errorResponse) {
    reportMetric(U2F_CLIENT_LIBRARY_ERROR, errorResponse, U2F_DECOUPLED_ROOT, U2F_METRICS_PATH);
}

function showSuspendedUserDiv(accountState, msgType) {
    hideAllContainers();
    $("#suspended_user_container").show();
    $(".deactivated-user").hide();
    if (!isDeactivatedUserMessageEnhancementEnabled) {
        $("#old_msg").show();
        return;
    }
    if (accountState === "SUSPENDED") {
        if (msgType === "Customer Request") {
            $("#suspended_user_customer_request").show();
        } else {
            if (msgType === "Non-Payment") {
                $("#suspended_user_non_payment").show();
            } else {
                if (msgType === "Fraudulent") {
                    $("#suspended_user_fraud").show();
                } else {
                    if (msgType === "Generic") {
                        $("#suspended_user_generic").show();
                    } else {
                        $("#suspended_user_generic").show();
                    }
                }
            }
        }
    } else {
        if (accountState === "CLOSED") {
            if (msgType === "Customer Request") {
                $("#suspended_user_customer_request").show();
            } else {
                if (msgType === "Non-Payment") {
                    $("#suspended_user_non_payment").show();
                } else {
                    if (msgType === "Fraudulent") {
                        $("#suspended_user_fraud").show();
                    } else {
                        if (msgType === "Generic") {
                            $("#closed_user_generic").show();
                        } else {
                            if (msgType === "Self Closed") {
                                $("#closed_user_self_closed").show();
                            } else {
                                $("#closed_user_generic").show();
                            }
                        }
                    }
                }
            }
        } else {
            if (accountState === "TERMINATED") {
                $("#terminated_user_generic").show();
            } else {
                $("#closed_user_generic").show();
            }
        }
    }
}

function showBookmarkedUrlMessageDiv() {
    hideAllContainers();
    $("#bookmarked_url_message_container").show();
}

function showMfaCustomerSupport() {
    hideAllContainers();
    $("#mfa_customer_service_container").show();
}

function showForgotPasswordPopupError(title, message) {
    $("#password_recovery_error_title").html(title);
    $("#password_recovery_error_message_description").html(message);
    $("#password_recovery_error_message").show();
}

function signin(resync, webauthn) {
    getMetadata(SIGN_IN, function(metadata1) {
        try {
            signinWithMetadata(resync, metadata1, webauthn);
        } catch (err) {}
    });
}
var setU2FSignResponse = function(data, mfaSerial) {
    if (typeof u2fResponse != "undefined") {
        if (mfaSerial === undefined) {
            data.mfaSerial = "";
        } else {
            data.mfaSerial = encodeURIComponent(mfaSerial);
        }
        if (typeof u2fResponse.signatureData != "undefined" && u2fResponse.signatureData != "") {
            data.mfaType = "U2F";
            data.signatureData = encodeURIComponent(u2fResponse.signatureData);
        }
        if (typeof u2fResponse.keyHandle != "undefined" && u2fResponse.keyHandle != "") {
            data.keyHandle = encodeURIComponent(u2fResponse.keyHandle);
        }
        if (typeof u2fResponse.clientData != "undefined" && u2fResponse.clientData != "") {
            data.clientData = encodeURIComponent(u2fResponse.clientData);
        }
    }
};
var setWebAuthnSignResponse = function(data, mfaSerial) {
    if (u2fResponse) {
        if (mfaSerial === undefined) {
            data.mfaSerial = "";
        } else {
            data.mfaSerial = encodeURIComponent(mfaSerial);
        }
        if (u2fResponse.response.signature && u2fResponse.response.authenticatorData) {
            data.mfaType = "U2F";
            var u2fCompatibleSignatureData = new Uint8Array(u2fResponse.response.authenticatorData.byteLength + u2fResponse.response.signature.byteLength);
            u2fCompatibleSignatureData.set(new Uint8Array(u2fResponse.response.authenticatorData), 0);
            u2fCompatibleSignatureData.set(new Uint8Array(u2fResponse.response.signature), u2fResponse.response.authenticatorData.byteLength);
            data.signatureData = base64UrlToString(u2fCompatibleSignatureData);
        }
        if (u2fResponse.id) {
            data.keyHandle = encodeURIComponent(u2fResponse.id);
        }
        if (u2fResponse.response.clientDataJSON) {
            data.clientData = base64UrlToString(u2fResponse.response.clientDataJSON);
        }
    }
};

function signinWithMetadata(resync, metadata1, webauthn) {
    var params = new requestParameters();
    var redirectURI = params.redirect_uri;
    var clientId = params.client_id;
    var codeChallenge = params.code_challenge;
    var codeChallengeMethod = params.code_challenge_method;
    var password = $("#password").val();
    var email = $("#email").val();
    var mfa1 = $("#mfaCode").val();
    var rememberMfa = "";
    var rememberMfaCheckbox = document.getElementById("remember_mfa_checkbox");
    if (rememberMfaCheckbox) {
        rememberMfa = rememberMfaCheckbox.checked;
    }
    var captchaToken = $("#captchaToken").val();
    var captchaGuess = $("#captchaGuess").val();
    var captchaObfuscationToken = $("#captchaObfuscationToken").val();
    otpGuess = $("#otpGuess").val();
    var mfa2 = "";
    if (resync) {
        mfa1 = $("#resync_mfa_code1").val();
        mfa2 = $("#resync_mfa_code2").val();
    }
    var data = {
        action: "authenticateRoot",
        email: email,
        password: password,
        redirect_uri: redirectURI,
        client_id: clientId,
        csrf: csrf,
        sessionId: sessionId,
        metadata1: metadata1,
        rememberMfa: rememberMfa
    };
    if (typeof mfa1 != "undefined" && mfa1.length > 0) {
        data.mfaType = rootLoginMfaType;
        data.mfa1 = mfa1;
    }
    if (typeof mfa2 != "undefined" && mfa2.length > 0) {
        data.mfa2 = mfa2;
    }
    if (typeof captchaToken != "undefined" && captchaToken.length > 0) {
        data.captcha_token = captchaToken;
    }
    if (typeof captchaGuess != "undefined" && captchaGuess.length > 0) {
        data.captcha_guess = captchaGuess;
    }
    if (typeof captchaStatusToken != "undefined" && captchaStatusToken.length > 0) {
        data.captcha_status_token = captchaStatusToken;
        captchaStatusToken = "";
    }
    if (typeof captchaObfuscationToken != "undefined" && captchaObfuscationToken.length > 0) {
        data.captchaObfuscationToken = captchaObfuscationToken;
    }
    if (typeof possessionChallengeOtpToken != "undefined" && possessionChallengeOtpToken.length > 0) {
        data.possessionChallengeOtpToken = possessionChallengeOtpToken;
    }
    if (typeof optionalEmailVerificationToken != "undefined" && optionalEmailVerificationToken.length > 0) {
        data.optionalEmailVerificationToken = optionalEmailVerificationToken;
    }
    if (typeof optionalVerificationMethodConfirmationToken != "undefined" && optionalVerificationMethodConfirmationToken.length > 0) {
        data.optionalVerificationMethodConfirmationToken = optionalVerificationMethodConfirmationToken;
    }
    if (typeof otpGuess != "undefined" && otpGuess.length > 0) {
        data.otp_guess = otpGuess;
    }
    if (typeof skipEmailVerification != "undefined" && skipEmailVerification === true) {
        data.skipEmailVerification = skipEmailVerification;
    }
    if (codeChallenge && codeChallengeMethod) {
        data.code_challenge = codeChallenge;
        data.code_challenge_method = codeChallengeMethod;
    }
    if (webauthn) {
        setWebAuthnSignResponse(data, mfaSerial);
    } else {
        setU2FSignResponse(data, mfaSerial);
    }
    $.post("/signin", data, function(data, status) {
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        clearCaptchaState();
        clearMfaUserInput();
        otpContainerController.clean();
        var state = data.state;
        if ("FAIL" === state) {
            removeSpinnerOnSigninButtonAndEnableTheButton();
            removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
            removeSpinnerOnResyncMfaButtonAndEnableTheButton();
            removeSpinnerOnOTPButtonAndEnableTheButton();
            if (data.properties.Captcha === "true") {
                captchaStatusToken = "";
                showCaptcha(data.properties.CES, data.properties.CaptchaURL, SIGNIN, true, data.properties.captchaObfuscationToken, email, data.properties.CaptchaType);
            } else {
                if (data.properties.PossessionChallenge === "true" || data.properties.OptionalEmailVerification === "true") {
                    showOTP(email, data);
                } else {
                    if (data.properties.confirmOptionalVerificationMethod === "true") {
                        showOptionalVerificationMethodConfirmationPage(data);
                    } else {
                        if (data.properties.AuthenticationFailureType === "Suspended") {
                            showSuspendedUserDiv(data.properties.AccountState, data.properties.MsgType);
                        } else {
                            if (data.properties.errorCode === "UserNotAuthorizedForVPCE") {
                                showVPCEErrorPage();
                            } else {
                                $("#mfaCode").val("");
                                $("#resync_mfa_code1").val("");
                                $("#resync_mfa_code2").val("");
                                showPasswordEntry(email);
                                errorMessageController.show(data.properties.Title, data.properties.Message);
                            }
                        }
                    }
                }
            }
        } else {
            if ("SUCCESS" === state) {
                if (data.properties.Captcha === "true") {
                    captchaStatusToken = "";
                    removeSpinnerOnSigninButtonAndEnableTheButton();
                    removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
                    removeSpinnerOnResyncMfaButtonAndEnableTheButton();
                    removeSpinnerOnOTPButtonAndEnableTheButton();
                    showCaptcha(data.properties.CES, data.properties.CaptchaURL, SIGNIN, false, data.properties.captchaObfuscationToken, email, data.properties.CaptchaType);
                } else {
                    if (data.properties.PossessionChallenge === "true" || data.properties.OptionalEmailVerification === "true") {
                        removeSpinnerOnSigninButtonAndEnableTheButton();
                        removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
                        removeSpinnerOnResyncMfaButtonAndEnableTheButton();
                        removeSpinnerOnOTPButtonAndEnableTheButton();
                        showOTP(email, data);
                        window.resendOtpTimer = setInterval(setResendOtpTimer(60), 1000);
                    } else {
                        if (data.properties.confirmOptionalVerificationMethod === "true") {
                            removeSpinnerOnSigninButtonAndEnableTheButton();
                            removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
                            removeSpinnerOnResyncMfaButtonAndEnableTheButton();
                            removeSpinnerOnOTPButtonAndEnableTheButton();
                            showOptionalVerificationMethodConfirmationPage(data);
                        } else {
                            window.location = data.properties.RedirectTo;
                        }
                    }
                }
            } else {
                removeSpinnerOnSigninButtonAndEnableTheButton();
                removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
                removeSpinnerOnResyncMfaButtonAndEnableTheButton();
                removeSpinnerOnOTPButtonAndEnableTheButton();
            }
        }
    }).fail(function(xhr) {
        u2fResponse = "";
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        removeSpinnerOnSigninButtonAndEnableTheButton();
        removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
        removeSpinnerOnResyncMfaButtonAndEnableTheButton();
        removeSpinnerOnOTPButtonAndEnableTheButton();
        handleAjaxCallFailure(xhr);
    });
}

function showVPCEErrorPage() {
    $("#signin-main-box").hide();
    $("#vpce-error-page").show();
}

function showCaptcha(token, captchaUrl, captchaReturnState, showError, obfuscationToken, email, captchaType) {
    state = captchaReturnState;
    hideAllContainers();
    $("#mfa_container").hide();
    u2fMfaController.hide();
    loginContainerController.hide();
    if ("AUDIO" === captchaType) {
        $("#image_captcha_div").hide();
        $("#audio_captcha_div").show();
        populateAudioCaptcha(token, captchaUrl, obfuscationToken, email);
    } else {
        $("#audio_captcha_div").hide();
        $("#image_captcha_div").show();
        populateCaptcha(token, captchaUrl, obfuscationToken, email);
    }
    $("#captchaGuess").val("");
    $("#captcha_container").show();
    $("#captchaGuess").focus();
    if (showError) {
        errorMessageController.show(loginpage_captchadiv_error_title, loginpage_captchadiv_error_message);
    }
}

function showOptionalVerificationMethodConfirmationPage(responseData) {
    hideAllContainers();
    optionalVerificationMethodConfirmationContainerController.clean();
    if (!!responseData.properties.optionalVerificationMethodConfirmationToken) {
        optionalVerificationMethodConfirmationToken = responseData.properties.optionalVerificationMethodConfirmationToken;
    }
    optionalVerificationMethodConfirmationContainerController.show();
}
var optionalVerificationMethodConfirmationContainerController = (function() {
    var show = function() {
        $("#optional_verification_method_confirmation_container").show();
    };
    var hide = function() {
        $("#optional_verification_method_confirmation_container").hide();
    };
    var clean = function() {
        if (typeof optionalVerificationMethodConfirmationToken != "undefined" && optionalVerificationMethodConfirmationToken.length > 0) {
            optionalVerificationMethodConfirmationToken = "";
        }
    };
    var requestInProgress = function() {
        $("#optional_verification_method_confirmation_verify_email").addClass("aws-signin-button-disabled");
        $("#optional_verification_method_confirmation_verify_email").attr("disabled", "disabled");
        $("#optional_verification_method_confirmation_verify_email_button_text").addClass("aws-signin-spinner-white");
    };
    var requestFinished = function() {
        $("#optional_verification_method_confirmation_verify_email_button_text").removeClass();
        $("#optional_verification_method_confirmation_verify_email").removeAttr("disabled");
        $("#optional_verification_method_confirmation_verify_email").removeClass("aws-signin-button-disabled");
    };
    return {
        show: show,
        hide: hide,
        clean: clean,
        requestInProgress: requestInProgress,
        requestFinished: requestFinished
    };
})();

function showOTP(email, responseData) {
    hideAllContainers();
    otpContainerController.clean();
    $("#otp_container").show();
    if (!!responseData.properties.possessionChallengeOtpToken) {
        possessionChallengeOtpToken = responseData.properties.possessionChallengeOtpToken;
    }
    if (!!responseData.properties.optionalEmailVerificationToken) {
        optionalEmailVerificationToken = responseData.properties.optionalEmailVerificationToken;
    }
    var otpHeadTitle = "";
    var otpGeneralMessageParagraph1 = "";
    var otpGeneralMessageParagraph2 = "";
    var showSkipVerificationLink = false;
    if (responseData.properties.PossessionChallenge === "true") {
        state = SIGNIN;
        otpHeadTitle = String(loginpage_otpdiv_head_tile);
        otpGeneralMessageParagraph1 = String(loginpage_otpdiv_general_message_before_email);
        otpGeneralMessageParagraph2 = String(loginpage_otpdiv_general_message_after_email);
    } else {
        if (responseData.properties.OptionalEmailVerification === "true") {
            state = OPTIONAL_EMAIL_VERIFICATION;
            showSkipVerificationLink = true;
            otpHeadTitle = String(loginpage_otpdiv_optional_email_verification_head_tile);
            otpGeneralMessageParagraph1 = String(loginpage_otpdiv_optional_email_verification_general_message_paragraph1);
            otpGeneralMessageParagraph2 = String(loginpage_otpdiv_optional_email_verification_general_message_paragraph2);
        }
    }
    otpContainerController.show(otpHeadTitle, otpGeneralMessageParagraph1, email, otpGeneralMessageParagraph2, showSkipVerificationLink);
    $("#otpGuess").focus();
    if (responseData.state === "FAIL") {
        if (responseData.properties.tokenExpired || responseData.properties.invalidToken) {
            otpContainerController.hide();
        }
        otpErrorMessageController.show("", responseData.properties.Message);
    } else {
        if (responseData.properties.Message) {
            otpSuccessMessageController.show("", responseData.properties.Message);
        }
    }
}
var otpContainerController = (function() {
    var show = function(otpHeadTitle, otpGeneralMessageParagraph1, email, otpGeneralMessageParagraph2, showSkipVerificationLink) {
        $("#otp_head_title").text(otpHeadTitle);
        $("#otp_general_message").show();
        $("#otp_general_message_paragraph1").html(otpGeneralMessageParagraph1);
        $("#otp_general_message_email_address").text(email);
        $("#otp_general_message_paragraph2").html(otpGeneralMessageParagraph2);
        $("#otp_general_label_box").show();
        $("#otp_general_input_box").show();
        $("#otp_general_button_box").show();
        $("#resend_otp_button_text").show();
        if (showSkipVerificationLink) {
            $("#otp_skip_verification_link").show();
        } else {
            $("#otp_skip_verification_link").hide();
        }
        $("#otp_change_account_link").show();
    };
    var hide = function() {
        $("#otp_general_message").hide();
        $("#otp_general_label_box").hide();
        $("#otp_general_input_box").hide();
        $("#otp_general_button_box").hide();
        $("#resend_otp_button_text").hide();
        $("#otp_skip_verification_link").hide();
        $("#otp_change_account_link").hide();
    };
    var clean = function() {
        if (typeof possessionChallengeOtpToken != "undefined" && possessionChallengeOtpToken.length > 0) {
            possessionChallengeOtpToken = "";
        }
        if (typeof optionalEmailVerificationToken != "undefined" && optionalEmailVerificationToken.length > 0) {
            optionalEmailVerificationToken = "";
        }
        if (typeof otpGuess != "undefined" && otpGuess.length > 0) {
            otpGuess = "";
        }
        skipEmailVerification = false;
        $("#otpGuess").val("");
    };
    return {
        show: show,
        hide: hide,
        clean: clean
    };
})();

function handleResendOtp(email) {
    getMetadata(RESEND_OTP, function(metadata1) {
        try {
            handleResendOtpWithMetadata(email, metadata1);
        } catch (err) {}
    });
}

function handleResendOtpWithMetadata(email, metadata1) {
    var params = new requestParameters();
    var redirectURI = params.redirect_uri;
    var clientId = params.client_id;
    var email = $("#email").val();
    var data = {
        action: "resendOtp",
        email: email,
        redirect_uri: redirectURI,
        client_id: clientId,
        csrf: csrf,
        sessionId: sessionId,
        metadata1: metadata1
    };
    if (typeof possessionChallengeOtpToken != "undefined" && possessionChallengeOtpToken.length > 0) {
        data.possessionChallengeOtpToken = possessionChallengeOtpToken;
    }
    if (typeof optionalEmailVerificationToken != "undefined" && optionalEmailVerificationToken.length > 0) {
        data.optionalEmailVerificationToken = optionalEmailVerificationToken;
    }
    disableResendButton();
    showSpinnerOnOTPButtonAndDisableTheButton();
    $.post("/signin", data, function(data, status) {
        hideErrors();
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        clearCaptchaState();
        clearMfaUserInput();
        otpContainerController.clean();
        $("#otpGuess").removeClass().addClass("awsui-textfield awsui-textfield-type-text");
        $("#otpGuess_input_alert").hide();
        var state = data.state;
        if ("FAIL" === state) {
            enableResendButton();
            removeSpinnerOnOTPButtonAndEnableTheButton();
            $("#otp_general_message").hide();
            showOTP(email, data);
        } else {
            if ("SUCCESS" === state) {
                $("#otp_general_message").show();
                removeSpinnerOnOTPButtonAndEnableTheButton();
                showOTP(email, data);
                window.resendOtpTimer = setInterval(setResendOtpTimer(60), 1000);
            } else {
                enableResendButton();
                removeSpinnerOnOTPButtonAndEnableTheButton();
            }
        }
    }).fail(function(xhr) {
        hideSigninInnerFullWidthContainer();
        showMarketingContainer();
        showSigninInnerContainer();
        removeSpinnerOnSigninButtonAndEnableTheButton();
        removeSpinnerOnMfaSubmitButtonAndEnableTheButton();
        removeSpinnerOnResyncMfaButtonAndEnableTheButton();
        removeSpinnerOnOTPButtonAndEnableTheButton();
        enableResendButton();
        handleAjaxCallFailure(xhr);
    });
}

function injectCaptchaScript(obToken, action, error) {
    var oldScriptElement = document.getElementById(captcha_script_ele_id);
    var newScriptElement = document.createElement("script");
    var encodedObToken = "";
    if (obToken) {
        encodedObToken = btoa(obToken);
    }
    newScriptElement.setAttribute("src", window.location.origin + "/captcha?obToken=" + encodedObToken + "&t=" + Date.now());
    newScriptElement.setAttribute("type", "text/javascript");
    newScriptElement.setAttribute("id", "captcha_script");
    newScriptElement.onload = function() {
        if (window.signinCaptcha.ces) {
            action();
        } else {
            error("Captcha load failed", window.signinCaptcha.error);
        }
    };
    oldScriptElement.replaceWith(newScriptElement);
}

function populateCaptcha(token, imgUrl, obfuscationToken, email) {
    hideCaptchaImageAndCanvas();
    $("#captchaObfuscationToken").val(obfuscationToken);
    $("#captchaEmail").val(email);
    if (imgUrl) {
        $("#captcha_image").show().attr("src", imgUrl);
        $("#captchaToken").val(token);
    } else {
        injectCaptchaScript(obfuscationToken, function() {
            $("#captchaToken").val(window.signinCaptcha.ces);
            window.signinCaptcha.paint("captcha_canvas");
            $("#captcha_canvas").show();
        }, errorMessageController.show);
    }
}

function populateAudioCaptcha(token, audioUrl, obfuscationToken, email) {
    $("#captchaObfuscationToken").val(obfuscationToken);
    $("#captchaEmail").val(email);
    $("#captchaToken").val(token);
    document.getElementById("audio_captcha").src = audioUrl;
    document.getElementById("audio_captcha").load();
    $("#pause_audio_captcha").hide();
    $("#play_audio_captcha").show();
}

function handleForgotPasswordFlow(preserveError, captchaType) {
    hideCaptchaImageAndCanvasForForgotPassword();
    $.ajax({
        type: "POST",
        url: "/signin",
        data: {
            action: "shouldShowCaptcha",
            forgotpassword: "true",
            csrf: csrf,
            sessionId: sessionId
        }
    }).done(function(data) {
        if ("SUCCESS" === data.state) {
            if (data.properties.Captcha === "false") {
                bypassCaptcha = true;
                showForgotPasswordPopupWithoutCaptcha(preserveError);
            } else {
                bypassCaptcha = false;
                showForgotPasswordPopupWithCaptcha(preserveError, captchaType);
            }
        } else {
            showForgotPasswordPopupWithCaptcha(false, captchaType);
        }
    }).fail(function(xhr) {
        showForgotPasswordPopupWithCaptcha(false, captchaType);
    });
}

function handleGetResetPasswordToken(recoveryEmail, captchaToken, captchaGuess) {
    getMetadata(GET_RESET_PASSWORD_TOKEN, function(metadata1) {
        try {
            handleGetResetPasswordTokenWithMetadata(recoveryEmail, captchaToken, captchaGuess, metadata1);
        } catch (err) {}
    });
}

function hideCaptchaImageAndCanvasForForgotPassword() {
    if ($("#password_recovery_captcha_canvas").length) {
        $("#password_recovery_captcha_canvas").hide();
    }
    $("#password_recovery_captcha_image").hide();
}

function hideCaptchaImageAndCanvas() {
    if ($("#captcha_canvas").length) {
        $("#captcha_canvas").hide();
    }
    $("#captcha_image").hide();
}

function handleGetResetPasswordTokenWithMetadata(recoveryEmail, captchaToken, captchaGuess, metadata1) {
    $.ajax({
        type: "POST",
        url: "/signin",
        data: {
            action: "getResetPasswordToken",
            email: recoveryEmail,
            captcha_token: captchaToken,
            captcha_guess: captchaGuess,
            metadata1: metadata1,
            csrf: csrf,
            sessionId: sessionId
        }
    }).done(function(data) {
        var state = data.state;
        if ("SUCCESS" === state) {
            if (data.properties && data.properties.recovery_result == "email_sent") {
                hideAllOnPasswordRecoveryPage();
                $("#email_sent_confirmation_div").show();
                $("#password_recovery_done_div").show();
            }
        } else {
            showForgotPasswordPopup();
            showForgotPasswordPopupError(data.properties.Title, data.properties.Message);
            handleForgotPasswordFlow(true, data.properties.CaptchaType);
            $("#password_recovery_captcha_guess").val("");
            $("#password_recovery_captcha_guess").addClass("error");
        }
    }).fail(function(xhr) {
        if (xhr.status >= 400 && xhr.status <= 499) {
            showForgotPasswordPopupError(general_error_bad_request_title, general_error_bad_request_message);
        }
        if (xhr.status >= 500 && xhr.status <= 599) {
            showForgotPasswordPopupError(general_error_internal_server_error_title, general_error_internal_server_error_message);
        }
    });
}

function populatePasswordRecoveryCaptcha(token, imgUrl, obToken) {
    if (imgUrl) {
        if ($("#password_recovery_captcha_canvas").length) {
            $("#password_recovery_captcha_canvas").hide();
        }
        $("#password_recovery_captcha_image").show().attr("src", imgUrl);
        $("#password_recovery_captcha_token").val(token);
    } else {
        $("#password_recovery_captcha_image").hide();
        $("#password_recovery_captcha_canvas").hide();
        injectCaptchaScript(obToken, function() {
            $("#password_recovery_captcha_token").val(window.signinCaptcha.ces);
            window.signinCaptcha.paint("password_recovery_captcha_canvas");
            $("#password_recovery_captcha_canvas").show();
        }, showForgotPasswordPopupError);
    }
}

function refreshForgotPasswordCaptcha() {
    $.ajax({
        type: "POST",
        url: "/signin",
        data: {
            action: "captcha",
            forgotpassword: "true",
            csrf: csrf,
            sessionId: sessionId
        }
    }).done(function(data) {
        if ("SUCCESS" === data.state) {
            populatePasswordRecoveryCaptcha(data.properties.CES, data.properties.CaptchaURL, data.properties.captchaObfuscationToken);
        }
    }).fail(function(xhr) {
        if (xhr.status >= 400 && xhr.status <= 499) {
            showForgotPasswordPopupError(general_error_bad_request_title, general_error_bad_request_message);
        }
        if (xhr.status >= 500 && xhr.status <= 599) {
            showForgotPasswordPopupError(general_error_internal_server_error_title, general_error_internal_server_error_message);
        }
    });
}

function refreshForgotPasswordAudioCaptcha() {
    $.ajax({
        type: "POST",
        url: "/signin",
        data: {
            action: "captcha",
            forgotpassword: "true",
            csrf: csrf,
            sessionId: sessionId,
            captchaType: "AUDIO"
        }
    }).done(function(data) {
        if ("SUCCESS" === data.state) {
            populatePasswordRecoveryAudioCaptcha(data.properties.CES, data.properties.CaptchaURL);
        }
    }).fail(function(xhr) {
        if (xhr.status >= 400 && xhr.status <= 499) {
            showForgotPasswordPopupError(general_error_bad_request_title, general_error_bad_request_message);
        }
        if (xhr.status >= 500 && xhr.status <= 599) {
            showForgotPasswordPopupError(general_error_internal_server_error_title, general_error_internal_server_error_message);
        }
    });
}

function populatePasswordRecoveryAudioCaptcha(token, url) {
    $("#password_recovery_captcha_token").val(token);
    var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
    passwordRecoveryAudioCaptcha.src = url;
    passwordRecoveryAudioCaptcha.load();
    $("#password_recovery_pause_audio_captcha").hide();
    $("#password_recovery_play_audio_captcha").show();
}

function showForgotPasswordPopupWithoutCaptcha(preserveError) {
    showForgotPasswordPopup();
    if (preserveError) {
        $("#password_recovery_error_message").show();
    } else {
        $("#password_recovery_error_message").hide();
    }
    $("#password_recovery_captcha_div").hide();
}

function showForgotPasswordPopupWithCaptcha(preserveError, captchaType) {
    showForgotPasswordPopup();
    if (preserveError) {
        $("#password_recovery_error_message").show();
    } else {
        $("#password_recovery_error_message").hide();
    }
    if ("AUDIO" === captchaType) {
        $("#password_recovery_image_captcha_div").hide();
        $("#password_recovery_audio_captcha_div").show();
        refreshForgotPasswordAudioCaptcha();
    } else {
        refreshForgotPasswordCaptcha();
    }
    $("#password_recovery_captcha_guess").focus();
}

function showForgotPasswordPopup() {
    hideAllOnPasswordRecoveryPage();
    $("#password_recovery_email_div").show();
    $("#password_recovery_email").val($("#email").val().trim());
    $("#password_recovery_ok_cancel_div").show();
    $("#password_recovery_captcha_div").show();
    $("#password_recovery_image_captcha_div").show();
    $("#password_recovery_audio_captcha_div").hide();
    $("#modal_div").removeClass().addClass("awsui-modal-__state-fadeIn awsui-modal-container");
    $("#modal_background_div").removeClass().addClass("awsui-modal-__state-fadeIn awsui-modal-overlay");
    setTimeout(function() {
        $("#modal_div").removeClass().addClass("awsui-modal-__state-showing awsui-modal-container");
        $("#modal_background_div").removeClass().addClass("awsui-modal-__state-showing awsui-modal-overlay");
        $("body").removeClass().addClass("awsui awsui-modal-open aws-signin-ui");
    }, 450);
}

function dismissForgotPasswordPopup() {
    var passwordRecoveryAudioCaptcha = document.getElementById("password_recovery_audio_captcha");
    if (passwordRecoveryAudioCaptcha != null && passwordRecoveryAudioCaptcha.src != null && passwordRecoveryAudioCaptcha.src !== "") {
        passwordRecoveryAudioCaptcha.pause();
        $("#password_recovery_pause_audio_captcha").hide();
        $("#password_recovery_play_audio_captcha").show();
    }
    $("#modal_div").removeClass().addClass("awsui-modal-__state-fadeOut awsui-modal-container");
    $("#modal_background_div").removeClass().addClass("awsui-modal-__state-fadeOut awsui-modal-overlay");
    setTimeout(function() {
        $("#modal_div").removeClass().addClass("awsui-modal-__state-hidden awsui-modal-container");
        $("#modal_background_div").removeClass().addClass("awsui-modal-__state-hidden awsui-modal-overlay");
        hideAllOnPasswordRecoveryPage();
        $("body").removeClass().addClass("awsui aws-signin-ui");
    }, 450);
    hideAllOnPasswordRecoveryPage();
}

function hideAllOnPasswordRecoveryPage() {
    $("#password_recovery_email").val("");
    $("#password_recovery_captcha_guess").val("");
    $("#password_recovery_error_message").hide();
    $("#password_recovery_email_div").hide();
    $("#email_sent_confirmation_div").hide();
    $("#password_recovery_captcha_div").hide();
    $("#password_recovery_captcha_guess").removeClass("error");
    $("#password_recovery_captchaGuess_input_alert").hide();
    $("#password_recovery_ok_cancel_div").hide();
    $("#password_recovery_done_div").hide();
}

function showCandidatePasswordEntry(email) {
    hideAllContainers();
    $("#candidate_email_label").text(email);
    $("#candidate_email").val(email);
    $("#resolving_input_alert").hide();
    errorMessageController.hide();
    $("#resolving_input").removeClass("error");
    $("#resolver_container").hide();
    candidateLoginContainerController.show();
    $("#candidate_password").val("");
    $("#candidate_password").focus();
}

function handleAjaxCallFailure(xhr) {
    if (xhr.status >= 400 && xhr.status <= 499) {
        errorMessageController.show(general_error_bad_request_title, general_error_bad_request_message);
    }
    if (xhr.status >= 500 && xhr.status <= 599) {
        errorMessageController.show(general_error_internal_server_error_title, general_error_internal_server_error_message);
    }
}

function showCandidateMfaEntry() {
    hideAllContainers();
    var candidateEmail = $("#candidate_email").val();
    candidateMfaContainer.hideSpinnerOnCandidateMfaSigninButtonAndEnableTheButton();
    candidateMfaContainer.show(candidateEmail);
}