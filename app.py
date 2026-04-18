from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ========== CONFIGURATION EMAIL - TES IDENTIFIANTS ==========
EMAIL_SENDER = "dia9amadu@gmail.com"           # Ton email
EMAIL_PASSWORD = "jxzs exbs nzem qvpb"         # Ton mot de passe d'application (16 caractères)
EMAIL_RECEIVER = "dia9amadu@gmail.com"         # Où tu reçois les messages

# ========== FICHIER DE SAUVEGARDE ==========
MESSAGES_FILE = "messages.json"

def save_message_to_json(message_data):
    """Sauvegarde le message dans le fichier JSON"""
    try:
        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
            messages = json.load(f)
    except FileNotFoundError:
        messages = []
    
    messages.append(message_data)
    
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    
    return True

def send_email_notification(name, email, message):
    """Envoie un email de notification"""
    try:
        # Créer l'email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECEIVER
        msg['Subject'] = f"📬 Nouveau message portfolio - {name}"
        
        # Corps de l'email en HTML
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4a6cf7;">📬 Nouveau message reçu !</h2>
                <div style="border-top: 2px solid #4a6cf7; margin: 15px 0;"></div>
                
                <p><strong>👤 Nom :</strong> {name}</p>
                <p><strong>📧 Email :</strong> <a href="mailto:{email}">{email}</a></p>
                <p><strong>📅 Date :</strong> {datetime.now().strftime('%d/%m/%Y à %H:%M:%S')}</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💬 Message :</strong>
                    <p style="margin-top: 10px; line-height: 1.6;">{message}</p>
                </div>
                
                <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
                    Message envoyé depuis ton portfolio
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))
        
        # Envoyer l'email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"✉️ Email envoyé à {EMAIL_RECEIVER}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur envoi email: {str(e)}")
        return False

@app.route('/send-message', methods=['POST'])
def send_message():
    try:
        # Récupérer les données
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not name or not email or not message:
            return jsonify({
                'success': False,
                'message': '⚠️ Tous les champs sont obligatoires'
            }), 400
        
        # Créer l'objet message
        new_message = {
            'id': datetime.now().strftime('%Y%m%d%H%M%S'),
            'date': datetime.now().strftime('%d/%m/%Y à %H:%M:%S'),
            'name': name,
            'email': email,
            'message': message
        }
        
        # Sauvegarder dans JSON
        save_message_to_json(new_message)
        
        # Envoyer l'email
        email_sent = send_email_notification(name, email, message)
        
        print(f"\n📨 Nouveau message reçu !")
        print(f"   👤 {name} ({email})")
        print(f"   💬 {message[:100]}...")
        print(f"   💾 Sauvegardé dans {MESSAGES_FILE}")
        print(f"   ✉️ Email envoyé: {'✅ Oui' if email_sent else '❌ Non'}\n")
        
        return jsonify({
            'success': True,
            'message': '✅ Message envoyé avec succès ! Je te répondrai rapidement.'
        })
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return jsonify({
            'success': False,
            'message': '❌ Erreur technique. Réessaie plus tard.'
        }), 500

# ========== PAGE ADMIN ==========
@app.route('/admin')
def admin_page():
    """Page admin pour visualiser les messages"""
    return send_from_directory('.', 'admin.html')

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """API pour récupérer tous les messages"""
    try:
        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
            messages = json.load(f)
        return jsonify(messages)
    except FileNotFoundError:
        return jsonify([])

@app.route('/api/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    """Supprimer un message"""
    try:
        with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
            messages = json.load(f)
        
        messages = [m for m in messages if m['id'] != message_id]
        
        with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True, 'message': 'Message supprimé'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 SERVEUR PORTFOLIO DÉMARRÉ")
    print("="*50)
    print(f"📧 Email configuré avec: {EMAIL_SENDER}")
    print(f"📍 Portfolio: http://localhost:5000")
    print(f"🔐 Admin: http://localhost:5000/admin")
    print(f"💾 Messages sauvegardés dans: {MESSAGES_FILE}")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)