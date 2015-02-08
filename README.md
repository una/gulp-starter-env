Starter Environment
---

What's set up here:

- Sass (LibSass)
- Autoprefixer
- CSS Minification
- JSHint
- Scss Lint (based on [this](https://github.com/causes/scss-lint/blob/master/config/default.yml) config)
- HTML Minification
- BrowserSync
- Image Minification

## To Get Started:

1. Install node and make sure npm (Node Project Manager) is also [installed](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
2. Clone this repo with `git clone https://github.com/una/gulp-starter-env` (in terminal) or download the zip
3. In terminal, `cd` (change directory) to the folder containing your project. (i.e. if I start at ~ and I have a Dev folder on my Desktop containing this project, I might type `cd Desktop/Dev/gulp-starter-env`). Alternatively, type `cd` and drag the location of the folder into your terminal and hit enter.
4. When inside the directory which contains this project in terminal, type `npm install`. If (and only if) you're having trouble with `npm install`, try `sudo npm install` -- this makes you act as a super user
5. In the terminal, enter `gulp`
6. Take note of the Access URLs provided in your terminal. Your web page should pop up at `http://localhost:3000`. You can access this same page on your various devices in the same wifi network with the provided External URL. You can share the External URL with coworkers and they'll see whats on your screen.
7. Edit your Sass code inside of the scss folder. You can make subfolders inside of that to better organize your code. Prefix your sass files with an underscore. More info on using @import to organize your files [here](http://sass-guidelin.es/#main-file)
8. Your minified files will be automatgically created and updated in `dist/`. It will create your optimized css, html, and javascript files for you. Never edit files within the `dist/` folder. (Dist stands for Distribution)
9. Keep gulp running while you're making changes. When you want to close out of the gulp task, in the terminal, hit `ctrl + C`

## Linting

File Linting is where you read your file to make sure that your code conforms to standards. You should be doing this continuously.

If you're using a text editor like Sublime, I'd recommend installing `SublimeLinter` and `SublimeLinter-contrib-scss-lint`. You can also lint with gulp inside of your terminal by running `gulp scss-lint`. Note: You need to have ruby installed to do this.