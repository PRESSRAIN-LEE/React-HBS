# React - ejs
1. 작업(개발)폴더 생성 (생성한 폴더에서 작업) - npx create-app-react-ejs-01
2. npm install express dotenv body-parser mysql ejs
3. npm install --save(-dev) nodemon
4. npm install handlebars-react (hbs)
5. npm install --save express-session
6. npm install --save express-fileupload (https://www.youtube.com/watch?v=hyJiNTFtQic)
7. npm install --save path
8. npm install --save bcrypt	(암호화)

9. npm install --save jsonwebtoken - 아직 사용하지 않음	(토큰)

10. npm install handlebars-paginate 		//pagination
11. npm install --save handlebars-helpers 	//hepler
12. npm install --save handlebars			//hepler
13. npm install --save fs			//파일 다운로드
14. npm install --save mime			//파일 다운로드
15. npm install --save iconv-lite	//파일 다운로드
16. npm install --save react-scripts	//build용 - uninstall대상


빌드과정




8. 파일 업로드 옵션 (https://www.npmjs.com/package/express-fileupload)
app.use(fileupload({
	defCharset: 'utf8',
    defParamCharset: 'utf8'
	//safeFileNames: true,
	//preserveExtension: true
}));





1. npx create-app-react-ejs-01
2. npm install express --save
3. npm install request --save
4. npm install body-parser --save
5. npm install mysql --save
6. npm install ejs --save




https://www.youtube.com/watch?v=1aXZQcG2Y6I




삭제: npm uninstall [모듈이름]
전역설치: npm install 모듈이름 -g

폴더 및 파일 설명
1. conf : DB 연결정보, API 키값 등 환경변수 정보 저장
2. public :  정적 파일을 위한 폴더로서 자바스크립트 파일, 이미지 파일, CSS 등을 포함합니다. 웹URL의 루트폴더로 생각하시면 됩니다. 관리를 쉽게하기 위해 js와 css로 폴더를 구분했습니다. 
3. routes :  라우팅을 위한 폴더입니다. 라우팅 리소스 별로 모듈을 만들어 라우팅 로직을 구현합니다. 클라이언트에서 요청 별로 어떤 로직을 수행할지 정해놓은 파일이라고 생각하시면 됩니다. (java에서는 Controller 역할)
4. views : request 요청에 대한 로직을 처리한 후 클라이언트에 응답을 보낼 때 html 코드로 변환해서 반환하는 파일을 정의한 폴더입니다.  여기선 ejs 템플릿을 사용합니다. 
5. app.js : express  설정파일이 담겨있는 파일입니다.(보통 파일 자동생성시 app.js 로 되어 있는데 cafe24를 호스팅으로 사용할 경우 파일이름이 web.js로 되어 있어야 합니다.)
6. package.json :  프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술합니다. (NPM은 이 정보를 참고하여 필요한 모듈을 관리)


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
