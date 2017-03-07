from flask import Flask, render_template,send_from_directory, jsonify, request
import os 
import os.path
from slimit import minify
from csscompressor import compress
import requests
import glob

app = Flask(__name__)

SITE_URL = "https://photo-embellish.herokuapp.com/"

js_values = ""

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

@app.route('/<file>', methods=['GET','POST'])
def code_file(file):
    #do your code here
    return send_from_directory(app.static_folder, file)

@app.route('/create_files', methods=['GET'])
def create_files():
	print "CREATE FILES"
	print "js_values? in createfiles"
	#print js_values
	#css_files = glob.glob("static/css/*.css")
	#js_files = glob.glob("static/js/*.js")
	min_css=minify_text("static/css/style.css", "css")
	min_js = js_values + minify_text("static/js/user.js", "js")+"animate();"
	data = {"css":min_css, "js":min_js}
	print "data to return: "
	print data
	return jsonify(result=data)

@app.route("/record_values", methods=["POST"])
def record_values():
	dat = request.data
	#print "THIS IS THE DATA"
	#print dat
	set_js_values(dat)
	print "js values in record values"
	#print js_values
	return "Done"

def set_js_values(vals):
	global js_values
	js_values = vals;
	
def write_to_file(content, file_name):
	print "CONTENT WRITTEN TO FILE: "
	print content
	with open("static/"+file_name+".txt", "w+") as text_file:
		text_file.write(content)

def minify_text(filepath, file_type):
	url = os.path.realpath('.')
	text = requests.get(SITE_URL+filepath).content
	if file_type is "js":
		minified = minify(text)
	elif file_type is "css":
		minified = compress(text)
	return minified



if __name__ == "__main__":
	#minify_text("static/js/draw.js", "js")
	port = int(os.environ.get("PORT", 4000))
	app.run(host='0.0.0.0', port=port)
	
