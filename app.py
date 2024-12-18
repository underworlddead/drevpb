from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/projects/<project_id>')
def load_project(project_id):
    # Define content for each project
    project_content = {
        'welcome': {
            'title': 'Welcome',
            'content': '''
                <h2>Welcome to My Project Showcase</h2>
                <p>This is the default Welcome Page. Use the Explorer to the left to navigate through the projects.</p>
            '''
        },
        'static': {
            'title': 'Static Project',
            'template': 'static_page.html'
        },
        'flutter': {
            'title': 'Flutter Emulator',
            'template': 'flutter_emulator.html'
        },
        'blog': {
            'title': 'Blog',
            'template': 'blog_page.html'
        }
    }

    if project_id not in project_content:
        return "Project not found", 404

    project = project_content[project_id]
    
    # Return direct content if specified
    if 'content' in project:
        return project['content']
    
    # Otherwise render template
    try:
        return render_template(project['template'])
    except:
        return f"<h2>{project['title']}</h2><p>Content coming soon...</p>"

if __name__ == '__main__':
    app.run(debug=True)