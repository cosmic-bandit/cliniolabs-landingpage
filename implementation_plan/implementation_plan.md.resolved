# Satış Akışı ve Fotoğraf Doğrulama Düzeltme Planı (v2)

## ✅ Çözüm Planı

### Düzeltme 1: Build Chat Prompt - Nazik Satış Hunisi

```
AŞAMA 1: KARŞILAMA (2 baloncuk)
├─ Baloncuk 1: "Merhaba! Ben Ayşe, Cliniolabs'te saç ekim danışmanıyım. Size nasıl yardımcı olabilirim?"
└─ Baloncuk 2: "Adınızı öğrenebilir miyim hitap edebilmek adına."

AŞAMA 2: HASTA SORU SORDUĞUNDA
└─ "Sorunuzu daha iyi cevaplayabilmem için..."
   ├─ YETERLİLİK (1/2): "Daha önce saç ekimi yaptırdınız mı? Saç dökülmeniz ne zamandır var?"
   └─ YETERLİLİK (2/2): "Ailenizde saç dökülmesi var mı? Herhangi bir ilaç kullanıyor musunuz?"

AŞAMA 3: CEVAPLAR ALINDI
└─ "Cevaplarınız için teşekkür ederim. Daha iyi durum değerlendirmesi için..."
   └─ FOTOĞRAF İSTE: "Ön, tepe ve ense bölgenizden fotoğraf alabilir miyim?"

AŞAMA 4: ANALİZ + CTA
└─ Fotoğraf gelince analiz yap, randevu teklif et
```

**Soru Grupları (İlgililiğe Göre):**
- Grup 1: Önceki ekim + Dökülme süresi (geçmiş/şuanki durum)
- Grup 2: Aile geçmişi + İlaç (genetik/sağlık faktörleri)

---

### Düzeltme 2: Multi-Image Vision - Toleranslı Doğrulama

```
## FOTOĞRAF DEĞERLENDİRME

✅ KABUL ET:
- Kafa/baş görünen herhangi bir fotoğraf (saçlı veya kel)
- Ön, tepe, yan, ense herhangi bir açı
- Bulanık veya uzaktan bile olsa kafa görünüyorsa KABUL
- Yüz olmadan sadece ense fotoğrafı (donör için ideal!)

❌ REDDET (sadece bunları):
- Kafa görünmeyen fotoğraflar (kol, bacak, manzara, vb.)
- Hayvan fotoğrafları (kedi, köpek, vb.)
- Alakasız görseller

⚠️ AÇIYA GÖRE YORUM:
- ÖN foto → Saçlı bölge analizi, donör hakkında YORUM YAPMA
- TEPE foto → Dökülme alanı analizi, donör hakkında YORUM YAPMA
- ENSE foto → Donör kalitesi değerlendir
```

> [!IMPORTANT]
> "Bu saç fotoğrafı mı?" yerine **"Bu kafa fotoğrafı mı?"** sorulacak.
> Norwood 7 hastada saç olmayabilir!

---

## 📋 Uygulama

| # | Node | Değişiklik |
|---|------|------------|
| 1 | `Build Chat Prompt` | Yumuşak satış hunisi, 2'li soru grupları |
| 2 | `Multi-Image Vision` | Kafa fotoğrafı kontrolü, toleranslı validation |

