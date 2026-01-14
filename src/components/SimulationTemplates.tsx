import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Beaker, 
  Atom, 
  Zap, 
  Droplets, 
  Sun, 
  Moon,
  Magnet,
  Flame,
  Wind,
  Waves,
  CircleDot,
  Triangle,
  Search,
  Library,
  Sparkles
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  difficulty: string;
  htmlCode: string;
}

const templates: Template[] = [
  {
    id: "pendulum",
    name: "محاكاة البندول البسيط",
    description: "بندول يتأرجح بحركة توافقية بسيطة مع التحكم في الطول والكتلة",
    category: "الفيزياء",
    icon: <CircleDot className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>محاكاة البندول البسيط</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 20px; font-size: 1.5rem; }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    canvas {
      background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .controls {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .control-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
    label { font-size: 0.9rem; opacity: 0.9; }
    input[type="range"] {
      width: 120px;
      cursor: pointer;
    }
    .value {
      background: rgba(255,255,255,0.1);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
    }
    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      padding: 10px 30px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <h1>🎯 محاكاة البندول البسيط</h1>
  <div class="container">
    <canvas id="canvas" width="400" height="400"></canvas>
    <div class="controls">
      <div class="control-group">
        <label>طول الخيط</label>
        <input type="range" id="length" min="80" max="180" value="150">
        <span class="value" id="lengthValue">150 px</span>
      </div>
      <div class="control-group">
        <label>الزاوية الابتدائية</label>
        <input type="range" id="angle" min="10" max="80" value="45">
        <span class="value" id="angleValue">45°</span>
      </div>
      <div class="control-group">
        <label>الجاذبية</label>
        <input type="range" id="gravity" min="1" max="20" value="10">
        <span class="value" id="gravityValue">10 m/s²</span>
      </div>
    </div>
    <button onclick="resetPendulum()">إعادة التشغيل 🔄</button>
  </div>

  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let length = 150;
    let angle = Math.PI / 4;
    let angleVelocity = 0;
    let gravity = 10;
    let damping = 0.999;
    
    const pivotX = canvas.width / 2;
    const pivotY = 50;
    
    document.getElementById('length').addEventListener('input', (e) => {
      length = parseInt(e.target.value);
      document.getElementById('lengthValue').textContent = length + ' px';
    });
    
    document.getElementById('angle').addEventListener('input', (e) => {
      const deg = parseInt(e.target.value);
      angle = (deg * Math.PI) / 180;
      angleVelocity = 0;
      document.getElementById('angleValue').textContent = deg + '°';
    });
    
    document.getElementById('gravity').addEventListener('input', (e) => {
      gravity = parseInt(e.target.value);
      document.getElementById('gravityValue').textContent = gravity + ' m/s²';
    });
    
    function resetPendulum() {
      angle = (parseInt(document.getElementById('angle').value) * Math.PI) / 180;
      angleVelocity = 0;
    }
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate pendulum position
      const bobX = pivotX + length * Math.sin(angle);
      const bobY = pivotY + length * Math.cos(angle);
      
      // Draw string with glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#667eea';
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw pivot
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#667eea';
      ctx.fill();
      
      // Draw bob with gradient
      const gradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 0, bobX, bobY, 25);
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(1, '#ff8c00');
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffd700';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Physics
      const angleAcceleration = (-gravity / length) * Math.sin(angle) * 0.1;
      angleVelocity += angleAcceleration;
      angleVelocity *= damping;
      angle += angleVelocity;
      
      requestAnimationFrame(draw);
    }
    
    draw();
  </script>
</body>
</html>`
  },
  {
    id: "water-cycle",
    name: "دورة المياه في الطبيعة",
    description: "محاكاة تفاعلية توضح مراحل دورة الماء: التبخر، التكاثف، الهطول",
    category: "العلوم",
    icon: <Droplets className="w-6 h-6" />,
    difficulty: "سهل",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>دورة المياه في الطبيعة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      overflow: hidden;
      height: 100vh;
    }
    .scene {
      position: relative;
      width: 100%;
      height: 100vh;
      background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #228B22 80%, #1a5c1a 100%);
    }
    .sun {
      position: absolute;
      top: 30px;
      right: 50px;
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
      border-radius: 50%;
      box-shadow: 0 0 60px #FFD700, 0 0 100px #FFA500;
      animation: pulse 3s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    .cloud {
      position: absolute;
      background: white;
      border-radius: 50px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .cloud1 {
      top: 80px;
      left: 20%;
      width: 150px;
      height: 60px;
      animation: float 8s infinite ease-in-out;
    }
    .cloud2 {
      top: 120px;
      left: 50%;
      width: 200px;
      height: 80px;
      animation: float 10s infinite ease-in-out reverse;
    }
    @keyframes float {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(30px); }
    }
    .ocean {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background: linear-gradient(180deg, #1E90FF 0%, #0066CC 100%);
    }
    .wave {
      position: absolute;
      top: -20px;
      width: 100%;
      height: 40px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%231E90FF' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E") repeat-x;
      animation: wave 3s linear infinite;
    }
    @keyframes wave {
      0% { background-position-x: 0; }
      100% { background-position-x: 1200px; }
    }
    .mountain {
      position: absolute;
      bottom: 25%;
      left: 60%;
      width: 0;
      height: 0;
      border-left: 120px solid transparent;
      border-right: 120px solid transparent;
      border-bottom: 200px solid #6B8E23;
    }
    .mountain-snow {
      position: absolute;
      bottom: calc(25% + 160px);
      left: calc(60% + 60px);
      width: 0;
      height: 0;
      border-left: 60px solid transparent;
      border-right: 60px solid transparent;
      border-bottom: 40px solid white;
    }
    .evaporation {
      position: absolute;
      bottom: 25%;
      left: 30%;
      display: flex;
      gap: 20px;
    }
    .vapor {
      width: 10px;
      height: 10px;
      background: rgba(255,255,255,0.7);
      border-radius: 50%;
      animation: rise 4s infinite;
    }
    .vapor:nth-child(2) { animation-delay: 0.5s; }
    .vapor:nth-child(3) { animation-delay: 1s; }
    .vapor:nth-child(4) { animation-delay: 1.5s; }
    .vapor:nth-child(5) { animation-delay: 2s; }
    @keyframes rise {
      0% { transform: translateY(0) scale(1); opacity: 0.8; }
      100% { transform: translateY(-200px) scale(2); opacity: 0; }
    }
    .rain {
      position: absolute;
      top: 180px;
      left: 52%;
      display: flex;
      gap: 8px;
    }
    .drop {
      width: 4px;
      height: 20px;
      background: linear-gradient(180deg, transparent, #4169E1);
      border-radius: 0 0 50% 50%;
      animation: fall 1.5s infinite;
    }
    .drop:nth-child(2) { animation-delay: 0.2s; }
    .drop:nth-child(3) { animation-delay: 0.4s; }
    .drop:nth-child(4) { animation-delay: 0.6s; }
    .drop:nth-child(5) { animation-delay: 0.8s; }
    @keyframes fall {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(150px); opacity: 0; }
    }
    .labels {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 30px;
      background: rgba(0,0,0,0.7);
      padding: 15px 30px;
      border-radius: 30px;
    }
    .label {
      color: white;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .label-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .title {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 10px 30px;
      border-radius: 25px;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
  <div class="scene">
    <div class="title">💧 دورة المياه في الطبيعة</div>
    <div class="sun"></div>
    <div class="cloud cloud1"></div>
    <div class="cloud cloud2"></div>
    <div class="mountain"></div>
    <div class="mountain-snow"></div>
    <div class="evaporation">
      <div class="vapor"></div>
      <div class="vapor"></div>
      <div class="vapor"></div>
      <div class="vapor"></div>
      <div class="vapor"></div>
    </div>
    <div class="rain">
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
    </div>
    <div class="ocean">
      <div class="wave"></div>
    </div>
    <div class="labels">
      <div class="label">
        <div class="label-dot" style="background: #FFD700;"></div>
        التبخر
      </div>
      <div class="label">
        <div class="label-dot" style="background: white;"></div>
        التكاثف
      </div>
      <div class="label">
        <div class="label-dot" style="background: #4169E1;"></div>
        الهطول
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: "electric-circuit",
    name: "الدائرة الكهربائية البسيطة",
    description: "دائرة كهربائية تفاعلية مع مفتاح ومصباح وبطارية",
    category: "الفيزياء",
    icon: <Zap className="w-6 h-6" />,
    difficulty: "سهل",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الدائرة الكهربائية البسيطة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 30px; }
    .circuit {
      position: relative;
      width: 350px;
      height: 280px;
      border: 4px solid #666;
      border-radius: 20px;
      background: #0a0a15;
    }
    .wire {
      position: absolute;
      background: #666;
      transition: background 0.3s;
    }
    .wire.active { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
    .wire-top { top: 0; left: 50px; right: 50px; height: 4px; }
    .wire-bottom { bottom: 0; left: 50px; right: 50px; height: 4px; }
    .wire-left { left: 0; top: 50px; bottom: 50px; width: 4px; }
    .wire-right { right: 0; top: 50px; bottom: 50px; width: 4px; }
    
    .battery {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .battery-body {
      width: 60px;
      height: 30px;
      background: linear-gradient(90deg, #ff4444 50%, #333 50%);
      border-radius: 5px;
      border: 2px solid #888;
    }
    .battery-cap {
      width: 8px;
      height: 15px;
      background: #888;
      border-radius: 0 3px 3px 0;
    }
    .battery-label {
      position: absolute;
      top: 35px;
      font-size: 0.8rem;
      color: #aaa;
    }
    
    .bulb {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .bulb-glass {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 200, 0.2);
      border: 3px solid #aaa;
      border-radius: 50% 50% 45% 45%;
      transition: all 0.3s;
    }
    .bulb-glass.on {
      background: radial-gradient(circle, #ffff88 0%, #ffcc00 100%);
      box-shadow: 0 0 50px #ffff00, 0 0 100px #ffcc00;
    }
    .bulb-base {
      width: 25px;
      height: 20px;
      background: linear-gradient(90deg, #666 0%, #888 50%, #666 100%);
      border-radius: 0 0 5px 5px;
    }
    .bulb-label {
      position: absolute;
      top: 85px;
      font-size: 0.8rem;
      color: #aaa;
    }
    
    .switch-container {
      position: absolute;
      right: -50px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .switch {
      width: 60px;
      height: 30px;
      background: #333;
      border-radius: 15px;
      cursor: pointer;
      position: relative;
      border: 2px solid #555;
      transition: background 0.3s;
    }
    .switch:hover { background: #444; }
    .switch-handle {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: #888;
      border-radius: 50%;
      transition: all 0.3s;
    }
    .switch.on .switch-handle {
      left: 33px;
      background: #00ff88;
      box-shadow: 0 0 10px #00ff88;
    }
    .switch-label {
      font-size: 0.8rem;
      color: #aaa;
    }
    
    .electrons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .electron {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #00ff88;
      border-radius: 50%;
      box-shadow: 0 0 10px #00ff88;
      opacity: 0;
    }
    
    .info {
      margin-top: 50px;
      padding: 20px;
      background: rgba(255,255,255,0.1);
      border-radius: 15px;
      max-width: 350px;
      text-align: center;
    }
    .info h3 { margin-bottom: 10px; color: #00ff88; }
    .info p { font-size: 0.9rem; line-height: 1.6; opacity: 0.9; }
  </style>
</head>
<body>
  <h1>⚡ الدائرة الكهربائية البسيطة</h1>
  
  <div class="circuit">
    <div class="wire wire-top"></div>
    <div class="wire wire-bottom"></div>
    <div class="wire wire-left"></div>
    <div class="wire wire-right"></div>
    
    <div class="bulb">
      <div class="bulb-glass" id="bulb"></div>
      <div class="bulb-base"></div>
      <span class="bulb-label">المصباح</span>
    </div>
    
    <div class="battery">
      <div class="battery-body"></div>
      <div class="battery-cap"></div>
      <span class="battery-label">البطارية</span>
    </div>
    
    <div class="switch-container">
      <div class="switch" id="switch" onclick="toggleSwitch()">
        <div class="switch-handle"></div>
      </div>
      <span class="switch-label">المفتاح</span>
    </div>
    
    <div class="electrons" id="electrons"></div>
  </div>
  
  <div class="info" id="info">
    <h3>📚 معلومة</h3>
    <p>اضغط على المفتاح لإغلاق الدائرة ومشاهدة المصباح يضيء!</p>
  </div>

  <script>
    let isOn = false;
    const switchEl = document.getElementById('switch');
    const bulb = document.getElementById('bulb');
    const wires = document.querySelectorAll('.wire');
    const info = document.getElementById('info').querySelector('p');
    
    function toggleSwitch() {
      isOn = !isOn;
      
      if (isOn) {
        switchEl.classList.add('on');
        bulb.classList.add('on');
        wires.forEach(w => w.classList.add('active'));
        info.textContent = 'الدائرة مغلقة! التيار الكهربائي يمر من البطارية عبر الأسلاك إلى المصباح فيضيء. ⚡';
        animateElectrons();
      } else {
        switchEl.classList.remove('on');
        bulb.classList.remove('on');
        wires.forEach(w => w.classList.remove('active'));
        info.textContent = 'الدائرة مفتوحة! لا يمر التيار الكهربائي لأن المفتاح يقطع المسار.';
        stopElectrons();
      }
    }
    
    let electronAnimations = [];
    
    function animateElectrons() {
      const container = document.getElementById('electrons');
      container.innerHTML = '';
      
      for (let i = 0; i < 5; i++) {
        const electron = document.createElement('div');
        electron.className = 'electron';
        container.appendChild(electron);
        
        const delay = i * 400;
        electronAnimations.push(setTimeout(() => animateElectron(electron), delay));
      }
    }
    
    function animateElectron(el) {
      if (!isOn) return;
      
      const path = [
        { x: 175, y: 280 },
        { x: 50, y: 280 },
        { x: 0, y: 230 },
        { x: 0, y: 50 },
        { x: 50, y: 0 },
        { x: 175, y: 0 },
        { x: 300, y: 0 },
        { x: 350, y: 50 },
        { x: 350, y: 230 },
        { x: 300, y: 280 },
        { x: 175, y: 280 }
      ];
      
      let step = 0;
      el.style.opacity = '1';
      
      function move() {
        if (!isOn) {
          el.style.opacity = '0';
          return;
        }
        
        el.style.left = path[step].x + 'px';
        el.style.top = path[step].y + 'px';
        
        step = (step + 1) % path.length;
        electronAnimations.push(setTimeout(move, 100));
      }
      
      move();
    }
    
    function stopElectrons() {
      electronAnimations.forEach(t => clearTimeout(t));
      electronAnimations = [];
      document.getElementById('electrons').innerHTML = '';
    }
  </script>
</body>
</html>`
  },
  {
    id: "solar-system",
    name: "النظام الشمسي",
    description: "محاكاة لحركة الكواكب حول الشمس مع معلومات عن كل كوكب",
    category: "الفلك",
    icon: <Sun className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>النظام الشمسي</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a15 100%);
      min-height: 100vh;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .solar-system {
      position: relative;
      width: 600px;
      height: 600px;
    }
    .sun {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      margin: -30px;
      background: radial-gradient(circle, #FFD700 0%, #FF8C00 50%, #FF4500 100%);
      border-radius: 50%;
      box-shadow: 0 0 60px #FFD700, 0 0 100px #FF8C00;
      animation: pulse 3s infinite;
      cursor: pointer;
      z-index: 10;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    .planet {
      position: absolute;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .planet:hover { transform: scale(1.5); }
    
    .mercury { width: 8px; height: 8px; background: #B0B0B0; }
    .venus { width: 12px; height: 12px; background: #E6C87A; }
    .earth { width: 14px; height: 14px; background: linear-gradient(135deg, #1E90FF 30%, #228B22 70%); }
    .mars { width: 10px; height: 10px; background: #CD5C5C; }
    .jupiter { width: 30px; height: 30px; background: linear-gradient(180deg, #D4A574 0%, #C4956A 50%, #B4855A 100%); }
    .saturn { width: 26px; height: 26px; background: #F4D58D; }
    .saturn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 10px;
      margin-left: -20px;
      margin-top: -5px;
      border: 2px solid rgba(244, 213, 141, 0.5);
      border-radius: 50%;
      transform: rotateX(60deg);
    }
    .uranus { width: 18px; height: 18px; background: #87CEEB; }
    .neptune { width: 17px; height: 17px; background: #4169E1; }
    
    .info-panel {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 15px 25px;
      border-radius: 15px;
      text-align: center;
      min-width: 300px;
    }
    .info-panel h3 { margin-bottom: 5px; color: #FFD700; }
    .info-panel p { font-size: 0.9rem; opacity: 0.9; }
    
    .title {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 1.5rem;
      text-shadow: 0 0 20px rgba(255,215,0,0.5);
    }
    
    .stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .star {
      position: absolute;
      background: white;
      border-radius: 50%;
      animation: twinkle 2s infinite;
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  </style>
</head>
<body>
  <h1 class="title">🌌 النظام الشمسي</h1>
  
  <div class="stars" id="stars"></div>
  
  <div class="solar-system">
    <div class="sun" onclick="showInfo('sun')"></div>
  </div>
  
  <div class="info-panel" id="info">
    <h3>☀️ الشمس</h3>
    <p>مركز نظامنا الشمسي، نجم يبلغ عمره 4.6 مليار سنة</p>
  </div>

  <script>
    const planets = [
      { name: 'mercury', ar: 'عطارد', orbit: 60, speed: 4, info: 'أقرب كوكب للشمس وأصغر كواكب المجموعة الشمسية' },
      { name: 'venus', ar: 'الزهرة', orbit: 90, speed: 3, info: 'ألمع كوكب في السماء، يُسمى توأم الأرض' },
      { name: 'earth', ar: 'الأرض', orbit: 120, speed: 2.5, info: 'كوكبنا! الكوكب الوحيد المعروف بوجود الحياة' },
      { name: 'mars', ar: 'المريخ', orbit: 155, speed: 2, info: 'الكوكب الأحمر، يملك أكبر بركان في المجموعة الشمسية' },
      { name: 'jupiter', ar: 'المشتري', orbit: 200, speed: 1.2, info: 'أكبر كوكب، يمكنه احتواء 1300 أرض!' },
      { name: 'saturn', ar: 'زحل', orbit: 250, speed: 0.9, info: 'مشهور بحلقاته الجميلة المكونة من الجليد والصخور' },
      { name: 'uranus', ar: 'أورانوس', orbit: 285, speed: 0.7, info: 'كوكب جليدي يدور على جانبه' },
      { name: 'neptune', ar: 'نبتون', orbit: 320, speed: 0.5, info: 'أبعد الكواكب، يملك أقوى رياح في المجموعة الشمسية' }
    ];
    
    const solarSystem = document.querySelector('.solar-system');
    
    // Create stars
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.width = star.style.height = Math.random() * 2 + 1 + 'px';
      star.style.animationDelay = Math.random() * 2 + 's';
      starsContainer.appendChild(star);
    }
    
    // Create planets
    planets.forEach(planet => {
      // Orbit
      const orbit = document.createElement('div');
      orbit.className = 'orbit';
      orbit.style.width = orbit.style.height = planet.orbit * 2 + 'px';
      orbit.style.marginLeft = orbit.style.marginTop = -planet.orbit + 'px';
      solarSystem.appendChild(orbit);
      
      // Planet
      const el = document.createElement('div');
      el.className = 'planet ' + planet.name;
      el.onclick = () => showInfo(planet.name);
      solarSystem.appendChild(el);
      
      // Animate
      let angle = Math.random() * Math.PI * 2;
      function animate() {
        angle += 0.01 * planet.speed;
        const x = 300 + planet.orbit * Math.cos(angle);
        const y = 300 + planet.orbit * Math.sin(angle);
        el.style.left = x - el.offsetWidth / 2 + 'px';
        el.style.top = y - el.offsetHeight / 2 + 'px';
        requestAnimationFrame(animate);
      }
      animate();
    });
    
    function showInfo(name) {
      const panel = document.getElementById('info');
      if (name === 'sun') {
        panel.innerHTML = '<h3>☀️ الشمس</h3><p>مركز نظامنا الشمسي، نجم يبلغ عمره 4.6 مليار سنة</p>';
      } else {
        const planet = planets.find(p => p.name === name);
        panel.innerHTML = '<h3>🪐 ' + planet.ar + '</h3><p>' + planet.info + '</p>';
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: "atom-structure",
    name: "تركيب الذرة",
    description: "نموذج تفاعلي للذرة يوضح النواة والإلكترونات",
    category: "الكيمياء",
    icon: <Atom className="w-6 h-6" />,
    difficulty: "سهل",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تركيب الذرة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0a0a20 0%, #1a1a40 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 20px;
    }
    h1 { margin-bottom: 30px; text-shadow: 0 0 20px rgba(100, 200, 255, 0.5); }
    .atom-container {
      position: relative;
      width: 350px;
      height: 350px;
    }
    .nucleus {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, #ff6b6b 0%, #c92a2a 100%);
      border-radius: 50%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 2px;
      padding: 8px;
      box-shadow: 0 0 30px rgba(255, 100, 100, 0.5);
      z-index: 10;
    }
    .proton, .neutron {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .proton { background: #ff4757; }
    .neutron { background: #747d8c; }
    
    .orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 2px solid rgba(100, 200, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .orbit-1 { width: 140px; height: 140px; animation: rotate 3s linear infinite; }
    .orbit-2 { width: 220px; height: 220px; animation: rotate 5s linear infinite reverse; }
    .orbit-3 { width: 300px; height: 300px; animation: rotate 7s linear infinite; }
    
    @keyframes rotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .electron {
      position: absolute;
      width: 14px;
      height: 14px;
      background: radial-gradient(circle, #74b9ff 0%, #0984e3 100%);
      border-radius: 50%;
      box-shadow: 0 0 15px #74b9ff;
    }
    
    .controls {
      display: flex;
      gap: 20px;
      margin-top: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .control {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .control label { font-size: 0.9rem; }
    .control input {
      width: 100px;
    }
    .value {
      background: rgba(255,255,255,0.1);
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 0.9rem;
    }
    
    .element-info {
      margin-top: 25px;
      background: rgba(255,255,255,0.1);
      padding: 20px 30px;
      border-radius: 15px;
      text-align: center;
    }
    .element-name {
      font-size: 1.5rem;
      color: #74b9ff;
      margin-bottom: 5px;
    }
    .element-symbol {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .legend {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.85rem;
    }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <h1>⚛️ تركيب الذرة</h1>
  
  <div class="atom-container" id="atom">
    <div class="nucleus" id="nucleus"></div>
    <div class="orbit orbit-1" id="orbit1"></div>
    <div class="orbit orbit-2" id="orbit2"></div>
    <div class="orbit orbit-3" id="orbit3"></div>
  </div>
  
  <div class="controls">
    <div class="control">
      <label>عدد البروتونات</label>
      <input type="range" id="protons" min="1" max="20" value="6">
      <span class="value" id="protonsValue">6</span>
    </div>
    <div class="control">
      <label>عدد النيوترونات</label>
      <input type="range" id="neutrons" min="0" max="20" value="6">
      <span class="value" id="neutronsValue">6</span>
    </div>
    <div class="control">
      <label>عدد الإلكترونات</label>
      <input type="range" id="electrons" min="1" max="20" value="6">
      <span class="value" id="electronsValue">6</span>
    </div>
  </div>
  
  <div class="element-info" id="elementInfo">
    <div class="element-symbol">C</div>
    <div class="element-name">كربون</div>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-dot" style="background: #ff4757;"></div>
        بروتون (+)
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #747d8c;"></div>
        نيوترون
      </div>
      <div class="legend-item">
        <div class="legend-dot" style="background: #74b9ff;"></div>
        إلكترون (-)
      </div>
    </div>
  </div>

  <script>
    const elements = {
      1: { symbol: 'H', name: 'هيدروجين' },
      2: { symbol: 'He', name: 'هيليوم' },
      3: { symbol: 'Li', name: 'ليثيوم' },
      4: { symbol: 'Be', name: 'بيريليوم' },
      5: { symbol: 'B', name: 'بورون' },
      6: { symbol: 'C', name: 'كربون' },
      7: { symbol: 'N', name: 'نيتروجين' },
      8: { symbol: 'O', name: 'أكسجين' },
      9: { symbol: 'F', name: 'فلور' },
      10: { symbol: 'Ne', name: 'نيون' },
      11: { symbol: 'Na', name: 'صوديوم' },
      12: { symbol: 'Mg', name: 'مغنيسيوم' },
      13: { symbol: 'Al', name: 'ألومنيوم' },
      14: { symbol: 'Si', name: 'سيليكون' },
      15: { symbol: 'P', name: 'فوسفور' },
      16: { symbol: 'S', name: 'كبريت' },
      17: { symbol: 'Cl', name: 'كلور' },
      18: { symbol: 'Ar', name: 'أرغون' },
      19: { symbol: 'K', name: 'بوتاسيوم' },
      20: { symbol: 'Ca', name: 'كالسيوم' }
    };
    
    function updateAtom() {
      const protons = parseInt(document.getElementById('protons').value);
      const neutrons = parseInt(document.getElementById('neutrons').value);
      const electrons = parseInt(document.getElementById('electrons').value);
      
      document.getElementById('protonsValue').textContent = protons;
      document.getElementById('neutronsValue').textContent = neutrons;
      document.getElementById('electronsValue').textContent = electrons;
      
      // Update nucleus
      const nucleus = document.getElementById('nucleus');
      nucleus.innerHTML = '';
      for (let i = 0; i < Math.min(protons, 8); i++) {
        const p = document.createElement('div');
        p.className = 'proton';
        nucleus.appendChild(p);
      }
      for (let i = 0; i < Math.min(neutrons, 8); i++) {
        const n = document.createElement('div');
        n.className = 'neutron';
        nucleus.appendChild(n);
      }
      
      // Update electrons
      const orbits = [
        { el: document.getElementById('orbit1'), max: 2 },
        { el: document.getElementById('orbit2'), max: 8 },
        { el: document.getElementById('orbit3'), max: 10 }
      ];
      
      orbits.forEach(o => o.el.innerHTML = '');
      
      let remaining = electrons;
      orbits.forEach((orbit, idx) => {
        const count = Math.min(remaining, orbit.max);
        remaining -= count;
        
        for (let i = 0; i < count; i++) {
          const e = document.createElement('div');
          e.className = 'electron';
          const angle = (i / count) * 360;
          const radius = [70, 110, 150][idx];
          e.style.top = '50%';
          e.style.left = '50%';
          e.style.marginTop = '-7px';
          e.style.marginLeft = '-7px';
          e.style.transform = 'rotate(' + angle + 'deg) translateX(' + radius + 'px)';
          orbit.el.appendChild(e);
        }
      });
      
      // Update element info
      const element = elements[protons] || { symbol: '?', name: 'غير معروف' };
      document.getElementById('elementInfo').innerHTML = 
        '<div class="element-symbol">' + element.symbol + '</div>' +
        '<div class="element-name">' + element.name + '</div>' +
        '<div class="legend">' +
        '<div class="legend-item"><div class="legend-dot" style="background: #ff4757;"></div>بروتون (+)</div>' +
        '<div class="legend-item"><div class="legend-dot" style="background: #747d8c;"></div>نيوترون</div>' +
        '<div class="legend-item"><div class="legend-dot" style="background: #74b9ff;"></div>إلكترون (-)</div>' +
        '</div>';
    }
    
    document.getElementById('protons').addEventListener('input', updateAtom);
    document.getElementById('neutrons').addEventListener('input', updateAtom);
    document.getElementById('electrons').addEventListener('input', updateAtom);
    
    updateAtom();
  </script>
</body>
</html>`
  },
  {
    id: "magnet",
    name: "المغناطيسية",
    description: "محاكاة تفاعلية توضح خطوط المجال المغناطيسي والتجاذب والتنافر",
    category: "الفيزياء",
    icon: <Magnet className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المغناطيسية</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 20px; }
    .container {
      position: relative;
      width: 500px;
      height: 350px;
      background: #0a0a15;
      border-radius: 15px;
      overflow: hidden;
    }
    .magnet {
      position: absolute;
      width: 120px;
      height: 50px;
      top: 50%;
      transform: translateY(-50%);
      cursor: grab;
      display: flex;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      transition: box-shadow 0.3s;
    }
    .magnet:hover { box-shadow: 0 5px 30px rgba(100,200,255,0.3); }
    .magnet:active { cursor: grabbing; }
    .magnet-1 { left: 80px; }
    .magnet-2 { right: 80px; }
    .pole {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
    .north { background: linear-gradient(180deg, #ff6b6b 0%, #c92a2a 100%); }
    .south { background: linear-gradient(180deg, #74b9ff 0%, #0984e3 100%); }
    
    .field-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .status {
      margin-top: 20px;
      padding: 15px 30px;
      background: rgba(255,255,255,0.1);
      border-radius: 25px;
      font-size: 1.1rem;
      transition: all 0.3s;
    }
    .attract { color: #74b9ff; }
    .repel { color: #ff6b6b; }
    
    .instructions {
      margin-top: 20px;
      text-align: center;
      opacity: 0.7;
      font-size: 0.9rem;
    }
    
    .flip-buttons {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    .flip-btn {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 10px 25px;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .flip-btn:hover {
      background: rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>
  <h1>🧲 المغناطيسية</h1>
  
  <div class="container" id="container">
    <canvas class="field-lines" id="canvas"></canvas>
    <div class="magnet magnet-1" id="magnet1" data-flipped="false">
      <div class="pole north">N</div>
      <div class="pole south">S</div>
    </div>
    <div class="magnet magnet-2" id="magnet2" data-flipped="false">
      <div class="pole south">S</div>
      <div class="pole north">N</div>
    </div>
  </div>
  
  <div class="status" id="status">اسحب المغناطيسات لرؤية التفاعل</div>
  
  <div class="flip-buttons">
    <button class="flip-btn" onclick="flipMagnet(1)">🔄 اقلب المغناطيس الأول</button>
    <button class="flip-btn" onclick="flipMagnet(2)">🔄 اقلب المغناطيس الثاني</button>
  </div>
  
  <p class="instructions">💡 اسحب المغناطيسات واقلبها لمشاهدة التجاذب والتنافر</p>

  <script>
    const container = document.getElementById('container');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const magnet1 = document.getElementById('magnet1');
    const magnet2 = document.getElementById('magnet2');
    const status = document.getElementById('status');
    
    canvas.width = 500;
    canvas.height = 350;
    
    let dragging = null;
    let offsetX, offsetY;
    
    function startDrag(e, magnet) {
      dragging = magnet;
      const rect = magnet.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      magnet.style.cursor = 'grabbing';
    }
    
    function drag(e) {
      if (!dragging) return;
      
      const containerRect = container.getBoundingClientRect();
      let x = e.clientX - containerRect.left - offsetX;
      let y = e.clientY - containerRect.top - offsetY;
      
      x = Math.max(0, Math.min(container.offsetWidth - 120, x));
      y = Math.max(0, Math.min(container.offsetHeight - 50, y));
      
      dragging.style.left = x + 'px';
      dragging.style.top = y + 'px';
      dragging.style.transform = 'none';
      
      updateFieldLines();
      checkInteraction();
    }
    
    function stopDrag() {
      if (dragging) {
        dragging.style.cursor = 'grab';
        dragging = null;
      }
    }
    
    magnet1.addEventListener('mousedown', (e) => startDrag(e, magnet1));
    magnet2.addEventListener('mousedown', (e) => startDrag(e, magnet2));
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    function flipMagnet(num) {
      const magnet = num === 1 ? magnet1 : magnet2;
      const isFlipped = magnet.dataset.flipped === 'true';
      magnet.dataset.flipped = !isFlipped;
      
      const poles = magnet.querySelectorAll('.pole');
      const temp = poles[0].className;
      poles[0].className = poles[1].className;
      poles[1].className = temp;
      
      const tempText = poles[0].textContent;
      poles[0].textContent = poles[1].textContent;
      poles[1].textContent = tempText;
      
      updateFieldLines();
      checkInteraction();
    }
    
    function checkInteraction() {
      const rect1 = magnet1.getBoundingClientRect();
      const rect2 = magnet2.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const x1 = rect1.left - containerRect.left + 60;
      const x2 = rect2.left - containerRect.left + 60;
      const distance = Math.abs(x2 - x1);
      
      // Get facing poles
      const m1RightPole = magnet1.querySelector('.pole:last-child').textContent;
      const m2LeftPole = magnet2.querySelector('.pole:first-child').textContent;
      
      const attract = (m1RightPole === 'N' && m2LeftPole === 'S') || 
                     (m1RightPole === 'S' && m2LeftPole === 'N');
      
      if (distance < 180) {
        if (attract) {
          status.textContent = '💙 تجاذب! الأقطاب المختلفة تتجاذب';
          status.className = 'status attract';
        } else {
          status.textContent = '❤️ تنافر! الأقطاب المتشابهة تتنافر';
          status.className = 'status repel';
        }
      } else {
        status.textContent = 'قرّب المغناطيسات لرؤية التفاعل';
        status.className = 'status';
      }
    }
    
    function updateFieldLines() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const rect1 = magnet1.getBoundingClientRect();
      const rect2 = magnet2.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const x1 = rect1.left - containerRect.left + 60;
      const y1 = rect1.top - containerRect.top + 25;
      const x2 = rect2.left - containerRect.left + 60;
      const y2 = rect2.top - containerRect.top + 25;
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // Draw field lines from magnet 1
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x1 + 60, y1 + i * 10);
        
        const midX = (x1 + x2) / 2;
        const curve = i * 30;
        
        ctx.bezierCurveTo(
          midX, y1 + curve,
          midX, y2 + curve,
          x2 - 60, y2 + i * 10
        );
        ctx.stroke();
      }
    }
    
    updateFieldLines();
  </script>
</body>
</html>`
  },
  {
    id: "photosynthesis",
    name: "عملية البناء الضوئي",
    description: "محاكاة توضح كيف تصنع النباتات غذاءها من الضوء والماء وثاني أكسيد الكربون",
    category: "الأحياء",
    icon: <Sparkles className="w-6 h-6" />,
    difficulty: "سهل",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عملية البناء الضوئي</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    h1 { color: #2E7D32; margin-bottom: 20px; }
    
    .scene {
      position: relative;
      width: 500px;
      height: 400px;
      background: linear-gradient(180deg, #81D4FA 0%, #4FC3F7 30%, #8B4513 70%, #5D4037 100%);
      border-radius: 20px;
      overflow: hidden;
    }
    
    .sun {
      position: absolute;
      top: 20px;
      right: 30px;
      width: 70px;
      height: 70px;
      background: radial-gradient(circle, #FFEB3B 0%, #FFC107 100%);
      border-radius: 50%;
      box-shadow: 0 0 50px #FFEB3B;
      animation: pulse 2s infinite;
    }
    
    .sun-rays {
      position: absolute;
      top: 90px;
      right: 65px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .ray {
      width: 4px;
      height: 80px;
      background: linear-gradient(180deg, rgba(255,235,59,0.8), transparent);
      transform-origin: top;
      animation: rayMove 2s infinite;
    }
    .ray:nth-child(1) { transform: rotate(-30deg); animation-delay: 0s; }
    .ray:nth-child(2) { transform: rotate(-15deg); animation-delay: 0.3s; }
    .ray:nth-child(3) { transform: rotate(0deg); animation-delay: 0.6s; }
    
    @keyframes rayMove {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    
    .plant {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .stem {
      width: 15px;
      height: 120px;
      background: linear-gradient(90deg, #4CAF50 0%, #388E3C 100%);
      margin: 0 auto;
      border-radius: 5px;
    }
    
    .leaf {
      position: absolute;
      width: 80px;
      height: 40px;
      background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%);
      border-radius: 0 70% 0 70%;
    }
    .leaf-1 { top: 20px; left: -70px; transform: rotate(-20deg); }
    .leaf-2 { top: 20px; right: -70px; transform: rotate(20deg) scaleX(-1); }
    .leaf-3 { top: 60px; left: -60px; transform: rotate(-10deg); }
    .leaf-4 { top: 60px; right: -60px; transform: rotate(10deg) scaleX(-1); }
    
    .roots {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
    }
    .root {
      position: absolute;
      width: 4px;
      height: 40px;
      background: #8D6E63;
      border-radius: 0 0 5px 5px;
    }
    .root-1 { left: 0; transform: rotate(-30deg); }
    .root-2 { left: 8px; transform: rotate(0deg); }
    .root-3 { left: 16px; transform: rotate(30deg); }
    
    .water-drops {
      position: absolute;
      bottom: 50px;
      left: calc(50% - 20px);
    }
    .water-drop {
      position: absolute;
      width: 8px;
      height: 12px;
      background: #2196F3;
      border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
      animation: absorb 3s infinite;
    }
    .water-drop:nth-child(1) { left: 0; animation-delay: 0s; }
    .water-drop:nth-child(2) { left: 20px; animation-delay: 1s; }
    .water-drop:nth-child(3) { left: 40px; animation-delay: 2s; }
    
    @keyframes absorb {
      0% { transform: translateY(30px); opacity: 1; }
      100% { transform: translateY(-80px); opacity: 0; }
    }
    
    .co2 {
      position: absolute;
      left: 30px;
      top: 150px;
    }
    .co2-molecule {
      display: flex;
      align-items: center;
      gap: 3px;
      animation: floatIn 4s infinite;
      margin-bottom: 20px;
    }
    .co2-molecule:nth-child(2) { animation-delay: 1.5s; }
    .co2-molecule:nth-child(3) { animation-delay: 3s; }
    .carbon { width: 16px; height: 16px; background: #424242; border-radius: 50%; }
    .oxygen-small { width: 12px; height: 12px; background: #E53935; border-radius: 50%; }
    
    @keyframes floatIn {
      0% { transform: translateX(-20px); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(120px); opacity: 0; }
    }
    
    .o2 {
      position: absolute;
      right: 30px;
      top: 150px;
    }
    .o2-molecule {
      display: flex;
      align-items: center;
      gap: 3px;
      animation: floatOut 4s infinite;
      margin-bottom: 20px;
    }
    .o2-molecule:nth-child(2) { animation-delay: 1.5s; }
    .o2-molecule:nth-child(3) { animation-delay: 3s; }
    .oxygen-big { width: 14px; height: 14px; background: #4CAF50; border-radius: 50%; }
    
    @keyframes floatOut {
      0% { transform: translateX(20px); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateX(-80px); opacity: 0; }
    }
    
    .glucose {
      position: absolute;
      bottom: 250px;
      left: 50%;
      transform: translateX(-50%);
    }
    .glucose-icon {
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, #FFC107 0%, #FF9800 100%);
      border-radius: 50%;
      animation: glucosePulse 2s infinite;
      box-shadow: 0 0 20px rgba(255,193,7,0.5);
    }
    @keyframes glucosePulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 1; }
    }
    
    .labels {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
      margin-top: 25px;
      max-width: 500px;
    }
    .label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      padding: 8px 15px;
      border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      font-size: 0.9rem;
    }
    .label-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .equation {
      margin-top: 20px;
      background: white;
      padding: 15px 25px;
      border-radius: 15px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.1);
      text-align: center;
    }
    .equation h3 { color: #2E7D32; margin-bottom: 10px; }
    .equation p { font-family: monospace; font-size: 1.1rem; }
  </style>
</head>
<body>
  <h1>🌱 عملية البناء الضوئي</h1>
  
  <div class="scene">
    <div class="sun"></div>
    <div class="sun-rays">
      <div class="ray"></div>
      <div class="ray"></div>
      <div class="ray"></div>
    </div>
    
    <div class="co2">
      <div class="co2-molecule">
        <div class="oxygen-small"></div>
        <div class="carbon"></div>
        <div class="oxygen-small"></div>
      </div>
      <div class="co2-molecule">
        <div class="oxygen-small"></div>
        <div class="carbon"></div>
        <div class="oxygen-small"></div>
      </div>
      <div class="co2-molecule">
        <div class="oxygen-small"></div>
        <div class="carbon"></div>
        <div class="oxygen-small"></div>
      </div>
    </div>
    
    <div class="o2">
      <div class="o2-molecule">
        <div class="oxygen-big"></div>
        <div class="oxygen-big"></div>
      </div>
      <div class="o2-molecule">
        <div class="oxygen-big"></div>
        <div class="oxygen-big"></div>
      </div>
      <div class="o2-molecule">
        <div class="oxygen-big"></div>
        <div class="oxygen-big"></div>
      </div>
    </div>
    
    <div class="plant">
      <div class="leaf leaf-1"></div>
      <div class="leaf leaf-2"></div>
      <div class="leaf leaf-3"></div>
      <div class="leaf leaf-4"></div>
      <div class="stem"></div>
    </div>
    
    <div class="glucose">
      <div class="glucose-icon"></div>
    </div>
    
    <div class="roots">
      <div class="root root-1"></div>
      <div class="root root-2"></div>
      <div class="root root-3"></div>
    </div>
    
    <div class="water-drops">
      <div class="water-drop"></div>
      <div class="water-drop"></div>
      <div class="water-drop"></div>
    </div>
  </div>
  
  <div class="labels">
    <div class="label">
      <div class="label-dot" style="background: #FFEB3B;"></div>
      ضوء الشمس (طاقة)
    </div>
    <div class="label">
      <div class="label-dot" style="background: #424242;"></div>
      CO₂ ثاني أكسيد الكربون
    </div>
    <div class="label">
      <div class="label-dot" style="background: #2196F3;"></div>
      H₂O الماء
    </div>
    <div class="label">
      <div class="label-dot" style="background: #4CAF50;"></div>
      O₂ الأكسجين
    </div>
    <div class="label">
      <div class="label-dot" style="background: #FFC107;"></div>
      الجلوكوز (سكر)
    </div>
  </div>
  
  <div class="equation">
    <h3>⚗️ معادلة البناء الضوئي</h3>
    <p>6CO₂ + 6H₂O + ضوء → C₆H₁₂O₆ + 6O₂</p>
  </div>
</body>
</html>`
  },
  {
    id: "sound-waves",
    name: "موجات الصوت",
    description: "محاكاة موجات الصوت مع التحكم في التردد والسعة والطول الموجي",
    category: "الفيزياء",
    icon: <Waves className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>موجات الصوت</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 20px; }
    .container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
    canvas {
      background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .controls { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
    .control-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    label { font-size: 0.9rem; opacity: 0.9; }
    input[type="range"] { width: 150px; cursor: pointer; }
    .value { background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
    .info { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
    .info-box { background: rgba(0,200,255,0.1); padding: 10px 20px; border-radius: 10px; text-align: center; }
    .info-box h3 { font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; }
    .info-box p { font-size: 1.1rem; color: #00d4ff; }
  </style>
</head>
<body>
  <h1>🔊 موجات الصوت</h1>
  <div class="container">
    <canvas id="canvas" width="600" height="250"></canvas>
    <div class="controls">
      <div class="control-group">
        <label>التردد (Hz)</label>
        <input type="range" id="frequency" min="20" max="2000" value="440">
        <span class="value" id="freqValue">440 Hz</span>
      </div>
      <div class="control-group">
        <label>السعة</label>
        <input type="range" id="amplitude" min="10" max="80" value="50">
        <span class="value" id="ampValue">50</span>
      </div>
      <div class="control-group">
        <label>سرعة العرض</label>
        <input type="range" id="speed" min="1" max="10" value="5">
        <span class="value" id="speedValue">5</span>
      </div>
    </div>
    <div class="info">
      <div class="info-box">
        <h3>الطول الموجي</h3>
        <p id="wavelength">0.78 م</p>
      </div>
      <div class="info-box">
        <h3>نوع الصوت</h3>
        <p id="soundType">صوت مسموع</p>
      </div>
      <div class="info-box">
        <h3>الدورة الزمنية</h3>
        <p id="period">2.27 مللي ث</p>
      </div>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let frequency = 440, amplitude = 50, speed = 5, time = 0;
    const speedOfSound = 343;
    
    function updateInfo() {
      const wavelength = (speedOfSound / frequency).toFixed(2);
      const period = (1000 / frequency).toFixed(2);
      document.getElementById('wavelength').textContent = wavelength + ' م';
      document.getElementById('period').textContent = period + ' مللي ث';
      let type = 'صوت مسموع';
      if (frequency < 20) type = 'تحت سمعي';
      else if (frequency < 200) type = 'صوت منخفض';
      else if (frequency > 2000) type = 'صوت حاد';
      document.getElementById('soundType').textContent = type;
    }
    
    document.getElementById('frequency').addEventListener('input', (e) => {
      frequency = parseInt(e.target.value);
      document.getElementById('freqValue').textContent = frequency + ' Hz';
      updateInfo();
    });
    document.getElementById('amplitude').addEventListener('input', (e) => {
      amplitude = parseInt(e.target.value);
      document.getElementById('ampValue').textContent = amplitude;
    });
    document.getElementById('speed').addEventListener('input', (e) => {
      speed = parseInt(e.target.value);
      document.getElementById('speedValue').textContent = speed;
    });
    
    function draw() {
      ctx.fillStyle = 'rgba(15, 15, 35, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height/2);
      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00d4ff';
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height/2 + amplitude * Math.sin((x * frequency/1000) + time * speed * 0.05);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw particles
      for (let i = 0; i < 20; i++) {
        const px = 30 + i * 28;
        const py = canvas.height/2 + amplitude * 0.8 * Math.sin((px * frequency/1000) + time * speed * 0.05);
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
      }
      
      time++;
      requestAnimationFrame(draw);
    }
    
    updateInfo();
    draw();
  </script>
</body>
</html>`
  },
  {
    id: "heat-transfer",
    name: "انتقال الحرارة",
    description: "محاكاة طرق انتقال الحرارة: التوصيل، الحمل، الإشعاع",
    category: "الفيزياء",
    icon: <Flame className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>انتقال الحرارة</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 15px; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .tab {
      padding: 10px 25px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .tab.active { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); }
    .tab:hover { transform: translateY(-2px); }
    canvas {
      background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .description {
      margin-top: 20px;
      background: rgba(255,255,255,0.1);
      padding: 15px 25px;
      border-radius: 15px;
      max-width: 500px;
      text-align: center;
    }
    .temp-display {
      display: flex;
      gap: 30px;
      margin-top: 15px;
    }
    .temp-box {
      background: rgba(0,0,0,0.3);
      padding: 10px 20px;
      border-radius: 10px;
      text-align: center;
    }
    .temp-box.hot { border: 2px solid #ff6b35; }
    .temp-box.cold { border: 2px solid #4da6ff; }
  </style>
</head>
<body>
  <h1>🌡️ انتقال الحرارة</h1>
  <div class="tabs">
    <button class="tab active" onclick="setMode('conduction')">التوصيل</button>
    <button class="tab" onclick="setMode('convection')">الحمل</button>
    <button class="tab" onclick="setMode('radiation')">الإشعاع</button>
  </div>
  <canvas id="canvas" width="500" height="300"></canvas>
  <div class="temp-display">
    <div class="temp-box hot">🔴 الساخن: <span id="hotTemp">100</span>°C</div>
    <div class="temp-box cold">🔵 البارد: <span id="coldTemp">20</span>°C</div>
  </div>
  <div class="description" id="desc">التوصيل: انتقال الحرارة عبر المادة من جزيء لآخر بالتلامس المباشر</div>
  
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let mode = 'conduction';
    let particles = [];
    let time = 0;
    
    const descriptions = {
      conduction: 'التوصيل: انتقال الحرارة عبر المادة من جزيء لآخر بالتلامس المباشر',
      convection: 'الحمل: انتقال الحرارة عبر حركة السوائل والغازات',
      radiation: 'الإشعاع: انتقال الحرارة عبر الموجات الكهرومغناطيسية دون وسيط'
    };
    
    function setMode(m) {
      mode = m;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('desc').textContent = descriptions[m];
      initParticles();
    }
    
    function initParticles() {
      particles = [];
      if (mode === 'conduction') {
        for (let i = 0; i < 50; i++) {
          particles.push({ x: 50 + i * 8, y: 150, temp: i < 25 ? 100 : 20 });
        }
      } else if (mode === 'convection') {
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: 150 + Math.random() * 200,
            y: 50 + Math.random() * 200,
            vy: 0,
            temp: 20 + Math.random() * 80
          });
        }
      } else {
        for (let i = 0; i < 15; i++) {
          particles.push({ x: 60, y: 80 + i * 10, progress: Math.random() });
        }
      }
    }
    
    function getColor(temp) {
      const ratio = (temp - 20) / 80;
      const r = Math.floor(255 * ratio);
      const b = Math.floor(255 * (1 - ratio));
      return 'rgb(' + r + ', 50, ' + b + ')';
    }
    
    function draw() {
      ctx.clearRect(0, 0, 500, 300);
      
      if (mode === 'conduction') {
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 120, 420, 60);
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(20, 110, 30, 80);
        
        particles.forEach((p, i) => {
          if (i > 0 && i < particles.length - 1) {
            const diff = (particles[i-1].temp + particles[i+1].temp) / 2 - p.temp;
            p.temp += diff * 0.01;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = getColor(p.temp);
          ctx.fill();
        });
        
        document.getElementById('hotTemp').textContent = Math.round(particles[0].temp);
        document.getElementById('coldTemp').textContent = Math.round(particles[particles.length-1].temp);
        
      } else if (mode === 'convection') {
        ctx.fillStyle = '#333';
        ctx.fillRect(140, 40, 220, 220);
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(200, 250, 100, 20);
        
        particles.forEach(p => {
          const heatDist = Math.abs(p.x - 250);
          if (p.y > 200 && heatDist < 60) {
            p.temp = Math.min(100, p.temp + 0.5);
            p.vy = -1.5;
          } else {
            p.temp = Math.max(20, p.temp - 0.1);
            p.vy += 0.02;
          }
          if (p.y < 50 || p.y > 240) p.vy *= -0.5;
          p.y += p.vy;
          p.y = Math.max(50, Math.min(240, p.y));
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = getColor(p.temp);
          ctx.fill();
        });
        
      } else {
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.arc(60, 150, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff6b35';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#4da6ff';
        ctx.fillRect(400, 100, 60, 100);
        
        particles.forEach(p => {
          p.progress += 0.01;
          if (p.progress > 1) p.progress = 0;
          const x = 100 + p.progress * 300;
          ctx.beginPath();
          ctx.arc(x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 200, 0, ' + (1 - p.progress * 0.5) + ')';
          ctx.fill();
        });
      }
      
      time++;
      requestAnimationFrame(draw);
    }
    
    initParticles();
    draw();
  </script>
</body>
</html>`
  },
  {
    id: "pressure",
    name: "الضغط",
    description: "محاكاة الضغط في الغازات والسوائل مع قانون باسكال",
    category: "الفيزياء",
    icon: <Wind className="w-6 h-6" />,
    difficulty: "متوسط",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>الضغط</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0c2461 0%, #1e3799 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 20px; }
    .container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
    canvas {
      background: linear-gradient(180deg, #0a1628 0%, #152642 100%);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .controls { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
    .control-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    label { font-size: 0.9rem; opacity: 0.9; }
    input[type="range"] { width: 150px; cursor: pointer; }
    .value { background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
    .result {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .result-box {
      background: rgba(116,185,255,0.2);
      padding: 15px 25px;
      border-radius: 15px;
      text-align: center;
    }
    .result-box h3 { font-size: 0.8rem; opacity: 0.7; margin-bottom: 5px; }
    .result-box p { font-size: 1.3rem; color: #74b9ff; }
    .formula {
      background: rgba(0,0,0,0.3);
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
  <h1>⚖️ الضغط</h1>
  <div class="container">
    <canvas id="canvas" width="450" height="300"></canvas>
    <div class="controls">
      <div class="control-group">
        <label>القوة (N)</label>
        <input type="range" id="force" min="10" max="500" value="100">
        <span class="value" id="forceValue">100 N</span>
      </div>
      <div class="control-group">
        <label>المساحة (cm²)</label>
        <input type="range" id="area" min="5" max="50" value="20">
        <span class="value" id="areaValue">20 cm²</span>
      </div>
    </div>
    <div class="result">
      <div class="result-box">
        <h3>الضغط</h3>
        <p id="pressure">5 N/cm²</p>
      </div>
      <div class="result-box">
        <h3>بالباسكال</h3>
        <p id="pressurePa">50,000 Pa</p>
      </div>
    </div>
    <div class="formula">P = F ÷ A</div>
  </div>
  
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let force = 100, area = 20;
    let pistonY = 80;
    const particles = [];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: 120 + Math.random() * 210,
        y: 100 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    
    function updatePressure() {
      const p = (force / area).toFixed(1);
      const pa = Math.round(force / area * 10000);
      document.getElementById('pressure').textContent = p + ' N/cm²';
      document.getElementById('pressurePa').textContent = pa.toLocaleString() + ' Pa';
    }
    
    document.getElementById('force').addEventListener('input', (e) => {
      force = parseInt(e.target.value);
      document.getElementById('forceValue').textContent = force + ' N';
      updatePressure();
    });
    
    document.getElementById('area').addEventListener('input', (e) => {
      area = parseInt(e.target.value);
      document.getElementById('areaValue').textContent = area + ' cm²';
      updatePressure();
    });
    
    function draw() {
      ctx.clearRect(0, 0, 450, 300);
      
      const pressure = force / area;
      const targetY = 60 + 40 * (1 - pressure / 25);
      pistonY += (targetY - pistonY) * 0.1;
      
      // Container
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(110, 50, 230, 230);
      
      // Fluid
      ctx.fillStyle = '#3498db';
      ctx.fillRect(120, pistonY + 30, 210, 240 - pistonY);
      
      // Piston rod
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(200, 10, 50, pistonY + 20);
      
      // Piston
      ctx.fillStyle = '#95a5a6';
      ctx.fillRect(120, pistonY + 20, 210, 15);
      
      // Force arrow
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(225, 10);
      ctx.lineTo(210, 35);
      ctx.lineTo(240, 35);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText('F = ' + force + ' N', 195, 55);
      
      // Particles
      const particleSpeed = pressure / 10;
      particles.forEach(p => {
        p.x += p.vx * particleSpeed;
        p.y += p.vy * particleSpeed;
        
        if (p.x < 125 || p.x > 325) p.vx *= -1;
        if (p.y < pistonY + 40 || p.y > 265) p.vy *= -1;
        
        p.x = Math.max(125, Math.min(325, p.x));
        p.y = Math.max(pistonY + 40, Math.min(265, p.y));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.4 + pressure/50) + ')';
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    }
    
    updatePressure();
    draw();
  </script>
</body>
</html>`
  },
  {
    id: "wave-properties",
    name: "خصائص الموجات",
    description: "محاكاة أنواع الموجات: المستعرضة، الطولية، والتداخل",
    category: "الفيزياء",
    icon: <Waves className="w-6 h-6" />,
    difficulty: "صعب",
    htmlCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خصائص الموجات</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      color: white;
    }
    h1 { margin-bottom: 15px; }
    .tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center; }
    .tab {
      padding: 10px 20px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }
    .tab.active { background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); }
    canvas {
      background: rgba(0,0,0,0.4);
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .controls { display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap; justify-content: center; }
    .control-group { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    label { font-size: 0.85rem; opacity: 0.8; }
    input[type="range"] { width: 120px; }
    .value { background: rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; }
    .legend { display: flex; gap: 20px; margin-top: 15px; flex-wrap: wrap; justify-content: center; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
    .legend-dot { width: 12px; height: 4px; border-radius: 2px; }
  </style>
</head>
<body>
  <h1>🌊 خصائص الموجات</h1>
  <div class="tabs">
    <button class="tab active" onclick="setMode('transverse')">موجة مستعرضة</button>
    <button class="tab" onclick="setMode('longitudinal')">موجة طولية</button>
    <button class="tab" onclick="setMode('interference')">التداخل</button>
    <button class="tab" onclick="setMode('standing')">موجة موقوفة</button>
  </div>
  <canvas id="canvas" width="600" height="250"></canvas>
  <div class="controls">
    <div class="control-group">
      <label>الطول الموجي (λ)</label>
      <input type="range" id="wavelength" min="30" max="150" value="80">
      <span class="value" id="waveVal">80</span>
    </div>
    <div class="control-group">
      <label>السعة (A)</label>
      <input type="range" id="amplitude" min="10" max="60" value="40">
      <span class="value" id="ampVal">40</span>
    </div>
    <div class="control-group">
      <label>السرعة</label>
      <input type="range" id="speed" min="1" max="10" value="5">
      <span class="value" id="speedVal">5</span>
    </div>
  </div>
  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#a855f7"></div>الموجة الأولى</div>
    <div class="legend-item"><div class="legend-dot" style="background:#22d3ee"></div>الموجة الثانية</div>
    <div class="legend-item"><div class="legend-dot" style="background:#f472b6"></div>المحصلة</div>
  </div>
  
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let mode = 'transverse';
    let wavelength = 80, amplitude = 40, speed = 5, time = 0;
    
    function setMode(m) {
      mode = m;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
    }
    
    document.getElementById('wavelength').addEventListener('input', (e) => {
      wavelength = parseInt(e.target.value);
      document.getElementById('waveVal').textContent = wavelength;
    });
    document.getElementById('amplitude').addEventListener('input', (e) => {
      amplitude = parseInt(e.target.value);
      document.getElementById('ampVal').textContent = amplitude;
    });
    document.getElementById('speed').addEventListener('input', (e) => {
      speed = parseInt(e.target.value);
      document.getElementById('speedVal').textContent = speed;
    });
    
    function draw() {
      ctx.clearRect(0, 0, 600, 250);
      const cy = 125;
      
      // Center line
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(600, cy);
      ctx.stroke();
      
      if (mode === 'transverse') {
        ctx.beginPath();
        for (let x = 0; x <= 570; x++) {
          const y = cy + amplitude * Math.sin((x / wavelength) * Math.PI * 2 - time * speed * 0.05);
          if (x === 0) ctx.moveTo(15, y);
          else ctx.lineTo(15 + x, y);
        }
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a855f7';
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        
      } else if (mode === 'longitudinal') {
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(10, cy - 35, 580, 70);
        
        for (let i = 0; i < 45; i++) {
          const baseX = 25 + i * 13;
          const displacement = amplitude * 0.25 * Math.sin((baseX / wavelength) * Math.PI * 2 - time * speed * 0.05);
          const x = baseX + displacement;
          const compression = Math.cos((baseX / wavelength) * Math.PI * 2 - time * speed * 0.05);
          ctx.beginPath();
          ctx.arc(x, cy, 4 + compression * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(168, 85, 247, ' + (0.5 + compression * 0.3) + ')';
          ctx.fill();
        }
        
      } else if (mode === 'interference') {
        // Wave 1
        ctx.beginPath();
        for (let x = 0; x <= 570; x++) {
          const y = cy - 50 + amplitude * 0.5 * Math.sin((x / wavelength) * Math.PI * 2 - time * speed * 0.05);
          if (x === 0) ctx.moveTo(15, y);
          else ctx.lineTo(15 + x, y);
        }
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Wave 2
        ctx.beginPath();
        for (let x = 0; x <= 570; x++) {
          const y = cy + 50 + amplitude * 0.5 * Math.sin((x / (wavelength * 0.8)) * Math.PI * 2 - time * speed * 0.04);
          if (x === 0) ctx.moveTo(15, y);
          else ctx.lineTo(15 + x, y);
        }
        ctx.strokeStyle = '#22d3ee';
        ctx.stroke();
        
        // Resultant
        ctx.beginPath();
        for (let x = 0; x <= 570; x++) {
          const y1 = amplitude * 0.5 * Math.sin((x / wavelength) * Math.PI * 2 - time * speed * 0.05);
          const y2 = amplitude * 0.5 * Math.sin((x / (wavelength * 0.8)) * Math.PI * 2 - time * speed * 0.04);
          if (x === 0) ctx.moveTo(15, cy + y1 + y2);
          else ctx.lineTo(15 + x, cy + y1 + y2);
        }
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
        
      } else if (mode === 'standing') {
        // Standing wave
        ctx.beginPath();
        for (let x = 0; x <= 570; x++) {
          const envelope = Math.sin((x / wavelength) * Math.PI * 2);
          const y = cy + amplitude * envelope * Math.cos(time * speed * 0.08);
          if (x === 0) ctx.moveTo(15, y);
          else ctx.lineTo(15 + x, y);
        }
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a855f7';
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        
        // Nodes
        for (let i = 0; i <= 7; i++) {
          const x = 15 + i * wavelength / 2;
          if (x < 585) {
            ctx.beginPath();
            ctx.arc(x, cy, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#22d3ee';
            ctx.fill();
          }
        }
      }
      
      time++;
      requestAnimationFrame(draw);
    }
    
    draw();
  </script>
</body>
</html>`
  }
];

interface SimulationTemplatesProps {
  onSelectTemplate: (htmlCode: string, title: string, description: string, category: string, difficulty: string) => void;
}

const SimulationTemplates = ({ onSelectTemplate }: SimulationTemplatesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.includes(search) || t.description.includes(search);
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (template: Template) => {
    onSelectTemplate(
      template.htmlCode,
      template.name,
      template.description,
      template.category,
      template.difficulty
    );
    setIsOpen(false);
    setPreviewTemplate(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "سهل": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "متوسط": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "صعب": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "الفيزياء": return "bg-blue-500/20 text-blue-400";
      case "الكيمياء": return "bg-purple-500/20 text-purple-400";
      case "الأحياء": return "bg-green-500/20 text-green-400";
      case "الفلك": return "bg-indigo-500/20 text-indigo-400";
      case "العلوم": return "bg-teal-500/20 text-teal-400";
      default: return "bg-muted";
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-dashed"
      >
        <Library className="w-4 h-4" />
        اختر من مكتبة القوالب
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Library className="w-6 h-6 text-simulation" />
              مكتبة قوالب المحاكاة التفاعلية
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن محاكاة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  الكل
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:border-simulation transition-all hover:shadow-lg group"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-simulation/10 flex items-center justify-center text-simulation group-hover:bg-simulation group-hover:text-white transition-colors">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-simulation transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Library className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لم يتم العثور على قوالب مطابقة</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewTemplate?.icon}
              {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-[400px] border rounded-lg overflow-hidden bg-white">
              {previewTemplate && (
                <iframe
                  srcDoc={previewTemplate.htmlCode}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                  title="معاينة المحاكاة"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              إلغاء
            </Button>
            <Button 
              onClick={() => previewTemplate && handleSelect(previewTemplate)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              استخدام هذا القالب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimulationTemplates;
