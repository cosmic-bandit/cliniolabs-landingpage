# Google Integrations Roadmap

## Genel Bakış

Bu roadmap, WhatsApp AI asistanına Google Sheets, Drive ve Calendar entegrasyonlarının eklenmesi için adım adım uygulama planını içerir.

---

## Faz 1: Google Sheets Entegrasyonu

### Adım 1.1: Tablo Oluşturma (Manuel)
- [ ] Google Sheets'te "Cliniolabs Hasta Takip" tablosu oluştur
- [ ] Kolonları ekle: created_at, phone, name, norwood, graft_min, graft_max, donor_quality, technique, summary, sentiment, purchase_rate, doctor_note, appointment_date, status, last_contact
- [ ] İlk satıra başlık ekle

### Adım 1.2: n8n Credential Ekleme
- [ ] n8n'de Google Sheets credential oluştur
- [ ] OAuth bağlantısını tamamla

### Adım 1.3: Sheets Node'ları Ekleme
- [ ] "Sheets - Create Row" node'u ekle (ilk kayıt için)
- [ ] "Sheets - Update Row" node'u ekle (güncelleme için)
- [ ] Read-Merge-Write logic'i uygula

### Adım 1.4: Tetikleme Noktalarını Bağla
- [ ] İlk mesaj → Row oluştur
- [ ] Analiz sonrası → Satır güncelle
- [ ] Before/After → Stage güncelle
- [ ] Randevu → Final güncelle

---

## Faz 2: Google Drive - Hasta Fotoğrafları

### Adım 2.1: Klasör Yapısı (Manuel)
- [ ] Drive'da "Cliniolabs" root klasörü oluştur
- [ ] "Patients" alt klasörü oluştur
- [ ] "Cases" alt klasörü oluştur

### Adım 2.2: n8n Credential Ekleme
- [ ] n8n'de Google Drive credential oluştur
- [ ] OAuth bağlantısını tamamla

### Adım 2.3: Foto Kaydetme Node'u
- [ ] Hasta klasörü bul/oluştur logic'i
- [ ] Fotoğrafı dosya adı formatıyla kaydet: `phone_norwood_greft_teknik_açı.jpg`
- [ ] Download All Photos node'una bağla

---

## Faz 3: Before/After Gönderimi

### Adım 3.1: Cases Klasörü (Manuel)
- [ ] Norwood_3, Norwood_4, Norwood_5, Norwood_6, Norwood_7 klasörleri oluştur
- [ ] Her klasöre birleşik before/after görselleri yükle
- [ ] Dosya adı formatı: `greft_teknik_süre.jpg` (örn: `4500_FUE_12ay.jpg`)

### Adım 3.2: Before/After Gönderim Node'u
- [ ] Cases/Norwood_X klasöründen görsel çek
- [ ] Dosya adından metadata parse et
- [ ] WhatsApp'a görsel gönder
- [ ] Bilgilendirme mesajı gönder

### Adım 3.3: Satış Modu Prompt Güncellemesi
- [ ] AI persona'ya satış modu talimatları ekle
- [ ] Stage = OFFERED olunca satış moduna geç

---

## Faz 4: Google Calendar - Randevu

### Adım 4.1: Calendar Credential (Manuel)
- [ ] Google Calendar API aktifle
- [ ] n8n'de Calendar credential oluştur
- [ ] OAuth bağlantısını tamamla

### Adım 4.2: Randevu Parse Logic
- [ ] Hasta mesajından tarih/saat çıkar
- [ ] Onay iste
- [ ] Calendar event oluştur

### Adım 4.3: Calendar Node'u
- [ ] Event oluşturma node'u ekle
- [ ] Google Meet linki oluştur
- [ ] Hastaya onay mesajı gönder

---

## Uygulama Sırası

```
Hafta 1:
├── Sheets tablo oluştur (Manuel) ← BAŞLANGIÇ NOKTASI
├── Sheets n8n credential
├── Sheets node'ları ekle
└── Test

Hafta 2:
├── Drive klasör yapısı (Manuel)
├── Drive n8n credential
├── Foto kaydetme node'u
└── Test

Hafta 3:
├── Cases klasörleri ve görselleri (Manuel)
├── Before/After gönderim node'u
├── Satış modu prompt güncellemesi
└── Test

Hafta 4:
├── Calendar credential (Manuel)
├── Randevu parse logic
├── Calendar event node'u
└── End-to-end test
```

---

## Öncelik Sırası

| # | Task | Kritiklik | Bağımlılık |
|---|------|-----------|------------|
| 1 | Sheets tablo oluştur | Yüksek | - |
| 2 | Sheets entegrasyonu | Yüksek | 1 |
| 3 | Drive klasör yapısı | Orta | - |
| 4 | Foto kaydetme | Orta | 3 |
| 5 | Cases görselleri | Orta | 3 |
| 6 | Before/After gönderim | Yüksek | 5 |
| 7 | Calendar credential | Düşük | - |
| 8 | Randevu sistemi | Orta | 6, 7 |

---

## Şu An Başlanacak İlk Adım

> **Adım 1.1: Google Sheets'te "Cliniolabs Hasta Takip" tablosu oluştur**

1. Google Sheets'e git
2. Yeni tablo oluştur, adı: "Cliniolabs Hasta Takip"
3. İlk satıra şu başlıkları ekle:

```
A1: created_at
B1: phone
C1: name
D1: norwood
E1: graft_min
F1: graft_max
G1: donor_quality
H1: technique
I1: summary
J1: sentiment
K1: purchase_rate
L1: doctor_note
M1: appointment_date
N1: status
O1: last_contact
```

4. Tablo hazır olunca paylaş, n8n credential için izin ver.
