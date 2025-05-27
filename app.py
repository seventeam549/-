from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "سلام، وب‌سایت مکان‌یابی فعال است!"

if __name__ == "__main__":
    app.run(debug=True)