from flask import Flask, render_template,send_from_directory, jsonify
import os 
import os.path
from slimit import minify
import requests

app = Flask(__name__)

MAIN_URL = "https://photo-embellish.herokuapp.com"

@app.route("/")
def main():
	return render_template("index.html")


@app.route('/js/<file>', methods=['GET','POST'])
def js_file(file):
    #do your code here
    return send_from_directory(app.static_folder, file)

@app.route('/css/<file>', methods=['GET','POST'])
def css_file(file):
    #do your code here
    return send_from_directory(app.static_folder, file)



def minify_text():
	url = os.path.realpath('.')
	text = requests.get(MAIN_URL+"/static/js/script/js")
	print minify(text)




if __name__ == "__main__":
	minify_text()
	port = int(os.environ.get("PORT", 5000))
	app.run(host='0.0.0.0', port=port)
	
