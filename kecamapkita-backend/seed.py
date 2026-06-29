import asyncio
from database import engine, AsyncSessionLocal
from models import Base, Kecamatan, Spot

mockKecamatan = {
    "Menteng": "POLYGON((106.8000 -6.2100, 106.8500 -6.2100, 106.8500 -6.1700, 106.8000 -6.1700, 106.8000 -6.2100))",
    "Jatinangor": "POLYGON((107.7000 -6.9500, 107.8000 -6.9500, 107.8000 -6.8500, 107.7000 -6.8500, 107.7000 -6.9500))",
    "Ubud": "POLYGON((115.2000 -8.5500, 115.3000 -8.5500, 115.3000 -8.4000, 115.2000 -8.4000, 115.2000 -8.5500))",
    "Cilandak": "POLYGON((106.7500 -6.3200, 106.8200 -6.3200, 106.8200 -6.2600, 106.7500 -6.2600, 106.7500 -6.3200))"
}

mockSpots = [
    {
        "id": 1,
        "name": "Taman Suropati",
        "kecamatan": "Menteng",
        "vibe": "syahdu",
        "type": "outdoor",
        "lat": -6.1993,
        "lng": 106.8326,
        "description": "Taman hijau nan rimbun di jantung kawasan elite Menteng. Tempat bertemunya seniman musik, pencinta alam, dan warga kota yang mendambakan keheningan sejenak dari hiruk-pikuk Jakarta.",
        "image": "https://images.unsplash.com/photo-1596306499317-8490232098fa?auto=format&fit=crop&w=800&q=80",
        "price": "Gratis",
        "hours": "05.00 - 22.00",
        "bestTime": "Pagi (Teduh & Sepi)",
        "crowdedness": { "pagi": 15, "siang": 35, "sore": 90, "malam": 45 }
    },
    {
        "id": 2,
        "name": "Nasi Uduk Gondangdia",
        "kecamatan": "Menteng",
        "vibe": "kenyang",
        "type": "indoor",
        "lat": -6.1878,
        "lng": 106.8329,
        "description": "Nasi uduk legendaris bernuansa khas Betawi asli sejak tahun 1993. Terkenal dengan bungkus daun pisangnya yang berbentuk kerucut unik serta sambal kacangnya yang gurih merem melek.",
        "image": "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80",
        "price": "Rp 15k - 40k",
        "hours": "09.00 - 21.00",
        "bestTime": "Sore Hari (Sepi Antrean)",
        "crowdedness": { "pagi": 10, "siang": 85, "sore": 40, "malam": 95 }
    },
    {
        "id": 3,
        "name": "Jatinangor House Co-Working",
        "kecamatan": "Jatinangor",
        "vibe": "kreatif",
        "type": "indoor",
        "lat": -6.9272,
        "lng": 107.7725,
        "description": "Kafe estetik dengan nuansa modern yang digandrungi mahasiswa lokal untuk nugas, belajar, ataupun berkolaborasi menciptakan ide-ide startup baru di Sumedang.",
        "image": "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
        "price": "Rp 20k - 50k",
        "hours": "08.00 - 23.00",
        "bestTime": "Pagi Hari (Wi-Fi Lancar)",
        "crowdedness": { "pagi": 30, "siang": 90, "sore": 80, "malam": 65 }
    },
    {
        "id": 4,
        "name": "Hutan Pinus Batu Kuda",
        "kecamatan": "Jatinangor",
        "vibe": "syahdu",
        "type": "outdoor",
        "lat": -6.8979,
        "lng": 107.7414,
        "description": "Destinasi wisata alam asri di kaki Gunung Manglayang. Pemandangan barisan pohon pinus yang menjulang tinggi menawarkan ketenangan hakiki bagi jiwa-jiwa penat.",
        "image": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
        "price": "Rp 15.000",
        "hours": "06.00 - 18.00",
        "bestTime": "Pagi Hari (Kabut Estetik)",
        "crowdedness": { "pagi": 40, "siang": 75, "sore": 55, "malam": 5 }
    },
    {
        "id": 5,
        "name": "Seniman Coffee Ubud",
        "kecamatan": "Ubud",
        "vibe": "kreatif",
        "type": "indoor",
        "lat": -8.5042,
        "lng": 115.2625,
        "description": "Pionir kopi gelombang ketiga di jantung Ubud. Menyajikan kopi berkualitas tinggi berpadu dengan furnitur rancangan daur ulang yang memicu kreativitas seni tingkat tinggi.",
        "image": "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
        "price": "Rp 35k - 75k",
        "hours": "07.30 - 22.00",
        "bestTime": "Pagi Hari (Inspiratif & Tenang)",
        "crowdedness": { "pagi": 50, "siang": 70, "sore": 85, "malam": 60 }
    },
    {
        "id": 6,
        "name": "Teras Sawah Tegalalang",
        "kecamatan": "Ubud",
        "vibe": "syahdu",
        "type": "outdoor",
        "lat": -8.4312,
        "lng": 115.2797,
        "description": "Pemandangan sawah terasering berundak-undak hijau ikonik yang mengagumkan. Melambangkan kearifan lokal sistem pengairan tradisional Subak Bali yang mendunia.",
        "image": "https://images.unsplash.com/photo-1558230315-5927395092cf?auto=format&fit=crop&w=800&q=80",
        "price": "Rp 25.000",
        "hours": "08.00 - 18.00",
        "bestTime": "Pagi Hari (Teduh & Adem)",
        "crowdedness": { "pagi": 25, "siang": 95, "sore": 60, "malam": 5 }
    }
]

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        # Seed Kecamatan
        for name, polygon in mockKecamatan.items():
            k = Kecamatan(name=name, lat=-6.2000, lng=106.8166)
            session.add(k)
        
        # Seed Spots
        for s in mockSpots:
            spot = Spot(
                id=s['id'],
                name=s['name'],
                description=s['description'],
                image_url=s['image'],
                hours=s['hours'],
                price=s['price'],
                best_time=s['bestTime'],
                vibe=s['vibe'],
                type=s['type'],
                crowdedness_pagi=s['crowdedness']['pagi'],
                crowdedness_siang=s['crowdedness']['siang'],
                crowdedness_sore=s['crowdedness']['sore'],
                crowdedness_malam=s['crowdedness']['malam'],
                lat=s['lat'],
                lng=s['lng']
            )
            session.add(spot)
            
        await session.commit()
        print("Database seeded successfully with Menteng, Jatinangor, Ubud, Cilandak and 6 core spots.")

if __name__ == "__main__":
    asyncio.run(seed())
