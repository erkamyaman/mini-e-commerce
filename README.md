<h1>🛒 Mini E-Commerce</h1>
<p>A lightweight e-commerce web application built with Angular, Tailwind CSS, PrimeNG, and JSON Server. It demonstrates state management with RxJS and BehaviorSubject.</p>

<h2>🚀 Features</h2>
<ul>
  <li>Product listing and browsing</li>
  <li>Shopping cart functionality</li>
  <li>Responsive design with Tailwind CSS</li>
  <li>Rich UI with PrimeNG</li>
  <li>Mock backend with JSON Server</li>
  <li>State management using Angular services and BehaviorSubject</li>
</ul>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Angular</strong> 19.2.7</li>
  <li><strong>Tailwind CSS</strong> for utility-first styling</li>
  <li><strong>PrimeNG</strong> for ready-made UI components</li>
  <li><strong>RxJS</strong> with <code>BehaviorSubject</code> for reactive state</li>
  <li><strong>JSON Server</strong> to simulate a RESTful backend</li>
</ul>

<h2>📦 Installation</h2>
<pre><code>git clone https://github.com/yamanerkam/mini-e-commerce.git
cd mini-e-commerce
npm install
</code></pre>

<h2>🧑‍💻 Development</h2>

<h3>Start Angular server</h3>
<pre><code>ng serve
</code></pre>
<p>Visit: <code>http://localhost:4200</code></p>

<h3>Start JSON server</h3>
<pre><code>npx json-server --watch db.json
</code></pre>
<p>JSON server will run on <code>http://localhost:3000</code></p>

<p><em>If you prefer global install:</em></p>
<pre><code>npm install -g json-server
</code></pre>

<h2>📁 Project Structure</h2>
<pre><code>mini-e-commerce/
├── src/
│   ├── app/               # Angular components and modules
│   ├── assets/            # Static files
│   └── environments/      # Angular environments
├── db.json                # Mock backend
├── angular.json           # Angular CLI config
├── package.json           # NPM config
├── tailwind.config.js     # Tailwind config
└── tsconfig.json          # TypeScript config
</code></pre>

<h2>🤝 Contributing</h2>
<p>Contributions are welcome! Please open an issue or pull request for enhancements or bug fixes.</p>

<h2>📄 License</h2>
<p>This project is licensed under the MIT License.</p>

