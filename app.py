from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    # Crear DataFrame con los datos
    data = {
        'Estación': ['YPF', 'SHELL', 'AXION'],
        'Promoción': ['15% Galicia', '20% Santander', '10% BBVA'],
        # ... resto de los datos
    }
    df = pd.DataFrame(data)
    return render_template('index.html', tables=[df.to_html(classes='data')], titles=df.columns.values) 