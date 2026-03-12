from models.database import SessionLocal, Performance


SEED_PERFORMANCES = [
    {
        "title": "Tandav – The Cosmic Dance",
        "performer": "Nritya Ensemble",
        "category": "Classical Dance",
        "year": 2025,
        "description": "A breathtaking Bharatanatyam performance depicting the cosmic dance of Lord Shiva, featuring intricate footwork and expressive abhinaya.",
        "image_url": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600",
        "duration": "18 min",
        "award": "Best Performance – Gold"
    },
    {
        "title": "Rang De Basanti",
        "performer": "JP College Choir",
        "category": "Group Singing",
        "year": 2025,
        "description": "An emotional patriotic medley celebrating the spirit of India through harmonized vocals and orchestral accompaniment.",
        "image_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600",
        "duration": "12 min",
        "award": "Best Vocal Group"
    },
    {
        "title": "Shadows & Secrets",
        "performer": "Drama Club – JP College",
        "category": "Drama",
        "year": 2025,
        "description": "A gripping one-act play about identity and belonging, performed entirely in Hindi with powerful stage direction.",
        "image_url": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600",
        "duration": "25 min",
        "award": "Best Direction"
    },
    {
        "title": "Garba Nights",
        "performer": "Folklore Dance Troupe",
        "category": "Folk Dance",
        "year": 2025,
        "description": "A vibrant Garba performance celebrating Gujarat's cultural heritage with traditional dandiya and colorful costumes.",
        "image_url": "https://images.unsplash.com/photo-1619983081563-430f63602796?w=600",
        "duration": "15 min",
        "award": "Audience Favorite"
    },
    {
        "title": "Fusion Beats",
        "performer": "Rhythm Collective",
        "category": "Music",
        "year": 2024,
        "description": "A fusion of classical Indian ragas with contemporary jazz, performed on sitar, tabla, and electric guitar.",
        "image_url": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600",
        "duration": "20 min",
        "award": "Best Instrumental"
    },
    {
        "title": "Hip-Hop Manifesto",
        "performer": "Street Vibe Crew",
        "category": "Western Dance",
        "year": 2024,
        "description": "High-energy hip-hop and freestyle dance battle celebrating urban youth culture with acrobatics and breakdancing.",
        "image_url": "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600",
        "duration": "10 min",
        "award": "Best Choreography"
    },
    {
        "title": "Echoes of Silence",
        "performer": "Mime & Movement Group",
        "category": "Mime",
        "year": 2024,
        "description": "A powerful silent performance exploring the emotions of a child's journey through education and dreams.",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
        "duration": "14 min",
        "award": "Special Jury Award"
    },
    {
        "title": "Kathak Kaleidoscope",
        "performer": "Priya Sharma & Ensemble",
        "category": "Classical Dance",
        "year": 2023,
        "description": "An elaborate Kathak recital featuring thumri and tarana in three movements, with live tabla accompaniment.",
        "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
        "duration": "22 min",
        "award": "Best Classical Presentation"
    },
]


def seed_performances():
    db = SessionLocal()
    try:
        count = db.query(Performance).count()
        if count == 0:
            for p in SEED_PERFORMANCES:
                perf = Performance(**p)
                db.add(perf)
            db.commit()
            print(f"[SEED] Added {len(SEED_PERFORMANCES)} performances")
    finally:
        db.close()
