Starter Environment
---

What's set up here:

- Sass (LibSass)
- Autoprefixer
- Minification & Uglify
- JsHint
- Scss Lint (based on [this](https://github.com/causes/scss-lint/blob/master/config/default.yml) config)

To Get Started:

1. Install node and npm [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
2. Install gulp with `npm install -g gulp`
3. clone this repo with `git clone https://github.com/una/gulp-starter-env` or download the zip
4. Open your terminal and `cd` (change directory) to the folder containing your project. (i.e. if I start at ~ and I have a Dev folder on my Desktop containing this project, I might type `cd Desktop/Dev/gulp-starter-env`)
5. In your terminal, in the directory which contains this project, type `npm install`. If (and only if) you're having trouble with `npm install`, try `sudo npm install` -- this makes you act as a super user
6. In the terminal, type `gulp`
7. Edit your code inside of the scss folder. You can make subfolders inside of that to better organize your code. Prefix your sass files with an underscore. More info on using @import to organize your files [here](http://sass-guidelin.es/#main-file)
8. Your minified files will be in `dist/`
9. Keep gulp running. When you want to close out of the gulp task, in the terminal, hit `ctrl + C`