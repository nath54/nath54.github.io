import os
import shutil

src_root = r"c:\Users\Nathan Cerisara\Documents\github\nath54.github.io\nouveau_site_5.0\pyxml_sources"
dest_root = r"c:\Users\Nathan Cerisara\Documents\github\nath54.github.io\nouveau_site_5.0\napp_engine_sources\naxml"

# Migration logic
def migrate_files(subdir, is_page=False):
    src_dir = os.path.join(src_root, subdir)
    dest_dir = os.path.join(dest_root, subdir)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    
    for filename in os.listdir(src_dir):
        if filename.endswith(".xml"):
            with open(os.path.join(src_dir, filename), "r", encoding="utf-8") as f:
                content = f.read()
            
            if is_page:
                content = f"<page>\n{content}\n</page>"
            
            dest_filename = filename.replace(".xml", ".naxml")
            with open(os.path.join(dest_dir, dest_filename), "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Migrated {subdir}/{filename} -> {subdir}/{dest_filename}")

migrate_files("pages", is_page=True)
migrate_files("components", is_page=False)
