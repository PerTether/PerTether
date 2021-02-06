var Auth = {
	vars: {
		login: document.querySelector('.login'),
		login_brand: document.querySelector('.login-brand'),
		login_wrapper: document.querySelector('.login-wrapper'),
		login_login: document.querySelector('.login-login'),
		login_wrapper_height: 0,
		login_back_link: document.querySelector('.login-back-link'),
		forgot_link: document.querySelector('.forgot-link'),
		login_link: document.querySelector('.login-link'),
		login_btn: document.querySelector('.login1-btn'),
		register_link: document.querySelector('.register-link'),
		password_group: document.querySelector('.password-group'),
		password_group_height: 0,
		login_register: document.querySelector('.login-register'),
		login_footer: document.querySelector('.login-footer'),
		box: document.getElementsByClassName('login-box'),
		option: {}
	},
	register(e) {
		Auth.vars.login_login.className += ' login-animated';
		setTimeout(() => {
			Auth.vars.login_login.style.display = 'none';
		}, 500);
		Auth.vars.login_register.style.display = 'block';
		Auth.vars.login_register.className += ' login-animated-flip';

		Auth.setHeight(Auth.vars.login_register.offsetHeight + Auth.vars.login_footer.offsetHeight);

		e.preventDefault();
	},
	login(e) {
		Auth.vars.login_register.classList.remove('login-animated-flip');
		Auth.vars.login_register.className += ' login-animated-flipback';
		Auth.vars.login_login.style.display = 'block';
		Auth.vars.login_login.classList.remove('login-animated');
		Auth.vars.login_login.className += ' login-animatedback';
		setTimeout(() => {
			Auth.vars.login_register.style.display = 'none';
		}, 500);
		
		setTimeout(() => {
			Auth.vars.login_register.classList.remove('login-animated-flipback');
			Auth.vars.login_login.classList.remove('login-animatedback');
		},1000);

		Auth.setHeight(Auth.vars.login_login.offsetHeight + Auth.vars.login_footer.offsetHeight);

		e.preventDefault();
	},
	forgot(e) {
		Auth.vars.password_group.classList += ' login-animated';
		Auth.vars.login_back_link.style.display = 'block';

		setTimeout(() => {
			Auth.vars.login_back_link.style.opacity = 1;
			Auth.vars.password_group.style.height = 0;
			Auth.vars.password_group.style.margin = 0;
		}, 100);
		
		Auth.vars.login_btn.innerText = 'Forgot Password';

		Auth.setHeight(Auth.vars.login_wrapper_height - Auth.vars.password_group_height);
		Auth.vars.login_login.querySelector('form').setAttribute('action', Auth.vars.option.forgot_url);

		e.preventDefault();
	},
	loginback(e) {
		Auth.vars.password_group.classList.remove('login-animated');
		Auth.vars.password_group.classList += ' login-animated-back';
		Auth.vars.password_group.style.display = 'block';

		setTimeout(() => {
			Auth.vars.login_back_link.style.opacity = 0;
			Auth.vars.password_group.style.height = Auth.vars.password_group_height + 'px';
			Auth.vars.password_group.style.marginBottom = 30 + 'px';
		}, 100);

		setTimeout(() => {
			Auth.vars.login_back_link.style.display = 'none';
			Auth.vars.password_group.classList.remove('login-animated-back');
		}, 1000);

		Auth.vars.login_btn.innerText = 'Sign In';
		Auth.vars.login_login.querySelector('form').setAttribute('action', Auth.vars.option.login_url);

		Auth.setHeight(Auth.vars.login_wrapper_height);
		
		e.preventDefault();
	},
	setHeight(height) {
		Auth.vars.login_wrapper.style.minHeight = height + 'px';
	},
	brand() {
		Auth.vars.login_brand.classList += ' login-animated';
		setTimeout(() => {
			Auth.vars.login_brand.classList.remove('login-animated');
		}, 1000);
	},
	init(option) {
		Auth.setHeight(Auth.vars.box[0].offsetHeight + Auth.vars.login_footer.offsetHeight);

		Auth.vars.password_group.style.height = Auth.vars.password_group.offsetHeight + 'px';
		Auth.vars.password_group_height = Auth.vars.password_group.offsetHeight;
		Auth.vars.login_wrapper_height = Auth.vars.login_wrapper.offsetHeight;

		Auth.vars.option = option;
		Auth.vars.login_login.querySelector('form').setAttribute('action', option.login_url);

		var len = Auth.vars.box.length - 1;

		for(var i = 0; i <= len; i++) {
			if(i !== 0) {
				Auth.vars.box[i].className += ' login-flip';
			}
		}

		Auth.vars.forgot_link.addEventListener("click", (e) => {
			Auth.forgot(e);
		});

		Auth.vars.register_link.addEventListener("click", (e) => {
			Auth.brand();
			Auth.register(e);
		});

		Auth.vars.login_link.addEventListener("click", (e) => {
			Auth.brand();
			Auth.login(e);
		});

		Auth.vars.login_back_link.addEventListener("click", (e) => {
			Auth.loginback(e);
		});
	}
}