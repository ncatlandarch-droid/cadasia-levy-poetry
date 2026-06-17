/* ============================================
   WORDS THAT HEAL — Generate Poem Audio Files
   Uses Gemini TTS (Aoede voice — calm, soothing, perfect for poetry)
   Generates WAV files for all poems in all languages
   ============================================ */

import https from 'https';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not set');
  process.exit(1);
}

const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const VOICE_NAME = 'Aoede'; // Calm, soothing female — perfect for poetry

const OUTPUT_DIR = path.resolve('assets/audio');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// All poems with their text in all languages
const poems = [
  {
    id: 'breathe',
    text: {
      en: `Just breathe love, why are you worried?
Why are you stressed?
God has his hand wrapped around you, trust me you're blessed.
Just breathe, even when you don't see it.
He's strengthening you day in and day out, to believe it.
The rage, the anger, the pain.
It all makes you want to break out in flames,
Show out, hate, and point the finger to blame.
Not while he is by your side
To remind you, it's ok, stay calm in this rip tide.

Just breathe love, you're doing your absolute best,
Keep showing up, keep pushing forward, your
days are coming where your worries will soon be to rest...`,
      es: `Solo respira amor, ¿por qué estás preocupada?
¿Por qué estás estresada?
Dios tiene su mano envuelta alrededor de ti, créeme estás bendecida.
Solo respira, incluso cuando no lo veas.
Él te está fortaleciendo día tras día, para creerlo.
La rabia, la ira, el dolor.
Todo te hace querer estallar en llamas,
Gritar, odiar, y señalar con el dedo para culpar.
No mientras él está a tu lado
Para recordarte, está bien, mantén la calma en esta marea.

Solo respira amor, estás dando lo mejor de ti,
Sigue apareciendo, sigue adelante, tus
días llegarán donde tus preocupaciones pronto descansarán...`,
      zh: `只管呼吸吧亲爱的，你为什么担心？
你为什么有压力？
上帝的手环绕着你，相信我，你是被祝福的。
只管呼吸，即使你看不到。
他日日夜夜在坚固你，让你相信。
愤怒、怒火、痛苦。
这一切让你想要爆发，
发泄、仇恨、指责他人。
但他在你身边的时候不会
提醒你，没关系，在这激流中保持平静。

只管呼吸吧亲爱的，你已经做到最好了，
继续出现，继续前进，你的
日子即将到来，你的忧虑将得到安息...`,
      sw: `Pumzika tu mpenzi, kwa nini una wasiwasi?
Kwa nini una msongo?
Mungu ana mkono wake umekuzunguka, niamini umebarikiwa.
Pumzika tu, hata usipokuona.
Anakuimarisha siku baada ya siku, kuamini.
Ghadhabu, hasira, maumivu.
Yote yanakufanya utake kulipuka kwa moto,
Kupiga kelele, kuchukia, na kumshitaki mtu.
Si wakati yeye yuko kando yako
Kukumbusha, ni sawa, tulia katika mkondo huu.

Pumzika tu mpenzi, unafanya vizuri kabisa,
Endelea kuonekana, endelea kusonga mbele,
siku zako zinakuja ambapo wasiwasi wako utapumzika...`
    }
  },
  {
    id: 'am-i-the-reason',
    text: {
      en: `Am I the reason it's so hard to love me?
Am I the reason you can't seem to hug me?
Hold me? Miss me? What did I do?
Is it me, or is it you?

I look in the mirror, and I question my face,
I question my body, I question this place.
Am I enough? Was I ever at all?
Or am I just someone you needed to call?

Am I the reason you walked out the door,
Left me standing, cold, on the floor?
I gave you my heart, every single piece,
But I guess my love wasn't enough for your peace.

So tell me the truth, don't spare me the pain,
Am I the reason? Or are you the blame?`,
      es: `¿Soy yo la razón por la que es tan difícil amarme?
¿Soy yo la razón por la que no puedes abrazarme?
¿Sostenerme? ¿Extrañarme? ¿Qué hice?
¿Soy yo, o eres tú?

Me miro al espejo y cuestiono mi rostro,
Cuestiono mi cuerpo, cuestiono este lugar.
¿Soy suficiente? ¿Lo fui alguna vez?
¿O solo soy alguien a quien necesitabas llamar?

¿Soy yo la razón por la que saliste por la puerta,
Me dejaste de pie, fría, en el suelo?
Te di mi corazón, cada pedazo,
Pero supongo que mi amor no fue suficiente para tu paz.

Así que dime la verdad, no me ahorres el dolor,
¿Soy yo la razón? ¿O eres tú el culpable?`,
      zh: `是我的原因，让你这么难爱我吗？
是我的原因，让你似乎无法拥抱我？
牵住我？想我？我做了什么？
是我的问题，还是你的？

我照着镜子，质疑我的脸，
质疑我的身体，质疑这个地方。
我够好吗？我曾经够好过吗？
还是我只是你需要打电话的某个人？

是我的原因让你走出了那扇门，
把我留在冰冷的地板上？
我把心交给了你，每一片，
但我猜我的爱不足以给你平静。

所以告诉我真相，别省去痛苦，
是我的原因？还是你该被责怪？`,
      sw: `Je, mimi ndio sababu ni vigumu sana kunipenda?
Je, mimi ndio sababu huwezi kunibembeleza?
Kunishika? Kunikosa? Nilifanya nini?
Ni mimi, au ni wewe?

Najiangalia kwenye kioo, na ninahoji uso wangu,
Ninahoji mwili wangu, ninahoji mahali hapa.
Je, ninatosha? Je, niliwahi kutosha?
Au mimi ni mtu tu uliyehitaji kumpigia simu?

Je, mimi ndio sababu ulitoka mlangoni,
Ukaniacha nimesimama, baridi, sakafuni?
Nilikupa moyo wangu, kila kipande,
Lakini nadhani upendo wangu haukutosha kwa amani yako.

Kwa hivyo niambie ukweli, usiniepushie maumivu,
Je, mimi ndio sababu? Au wewe ndio wa kulaumiwa?`
    }
  }
];

// Locked poems — generate first stanza only (15-sec preview)
const lockedPoems = [
  {
    id: 'can-i-escape',
    text: {
      en: `Can I escape from the pain that keeps me from seeing,
Seeing who I truly am, past being a human being.
Loving on me, praising on me, holding myself tight,
Can I escape, from what's keeping me from
showing myself, how it's done right.`,
      es: `¿Puedo escapar del dolor que me impide ver,
Ver quién soy realmente, más allá de ser un ser humano.
Amándome, alabándome, abrazándome fuerte,
¿Puedo escapar de lo que me impide
mostrarme a mí misma cómo se hace bien?`,
      zh: `我能逃脱那阻止我看清的痛苦吗，
看清我真正是谁，超越只是一个人类。
爱自己，赞美自己，紧紧拥抱自己，
我能逃脱那阻止我的东西吗
展示给自己，什么是正确的方式。`,
      sw: `Je, naweza kutoroka maumivu yanayonizuia kuona,
Kuona mimi ni nani kweli, zaidi ya kuwa binadamu.
Kujipenda, kujisifu, kujishika kwa nguvu,
Je, naweza kutoroka, kutoka kwa kile kinachonizuia
kujionyesha, jinsi inavyofanywa sawa.`
    }
  },
  {
    id: 'how-could-you',
    text: {
      en: `How could you leave me in the cold
Without a story left to be told
I gave you everything, my soul, my heart,
How could you choose to rip it all apart
How could you look me in my eyes,
and use what you see for a disguise.`,
      es: `Cómo pudiste dejarme en el frío
Sin una historia que quedara por contar
Te di todo, mi alma, mi corazón,
Cómo pudiste elegir destrozarlo todo
Cómo pudiste mirarme a los ojos,
y usar lo que ves como un disfraz.`,
      zh: `你怎么能把我丢在寒冷中
没有留下任何故事
我给了你一切，我的灵魂，我的心，
你怎么能选择把它全部撕碎
你怎么能看着我的眼睛，
把你看到的当作伪装。`,
      sw: `Ungewezaje kuniacha katika baridi
Bila hadithi iliyobaki kusemwa
Nilikupa kila kitu, roho yangu, moyo wangu,
Ungewezaje kuchagua kurarua yote
Ungewezaje kuniangalia machoni,
na kutumia unachokiona kama kifuniko.`
    }
  },
  {
    id: 'the-idea-of-me',
    text: {
      en: `You like me? You love me?
No, you love the idea of me.
The idea that I'm something
You think you can see.
But behind the smile, behind the face,
Is a woman still searching for her place.`,
      es: `¿Te gusto? ¿Me amas?
No, amas la idea de mí.
La idea de que soy algo
Que crees poder ver.
Pero detrás de la sonrisa, detrás del rostro,
Hay una mujer que aún busca su lugar.`,
      zh: `你喜欢我？你爱我？
不，你爱的是我的假象。
那个你认为我是的样子
你以为你能看到的。
但在微笑背后，在面容背后，
是一个仍在寻找自己位置的女人。`,
      sw: `Unanipenda? Unanipenda?
Hapana, unapenda wazo la mimi.
Wazo kwamba mimi ni kitu
Unadhani unaweza kuona.
Lakini nyuma ya tabasamu, nyuma ya uso,
Ni mwanamke bado anatafuta nafasi yake.`
    }
  }
];

const allPoems = [...poems, ...lockedPoems];
const languages = ['en', 'es', 'zh', 'sw'];

async function generateTTS(text, voiceName = VOICE_NAME) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } }
      }
    }
  });

  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`;
    const urlObj = new URL(url);

    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const audioPart = json.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (!audioPart) {
            reject(new Error('No audio returned: ' + data.substring(0, 200)));
            return;
          }
          resolve(audioPart.inlineData);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function pcmToWav(base64Data, sampleRate = 24000) {
  const pcmBytes = Buffer.from(base64Data, 'base64');
  const dataSize = pcmBytes.length;
  const wavBuffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  wavBuffer.write('RIFF', 0);
  wavBuffer.writeUInt32LE(36 + dataSize, 4);
  wavBuffer.write('WAVE', 8);
  wavBuffer.write('fmt ', 12);
  wavBuffer.writeUInt32LE(16, 16);       // chunk size
  wavBuffer.writeUInt16LE(1, 20);        // PCM format
  wavBuffer.writeUInt16LE(1, 22);        // Mono
  wavBuffer.writeUInt32LE(sampleRate, 24);
  wavBuffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  wavBuffer.writeUInt16LE(2, 32);        // block align
  wavBuffer.writeUInt16LE(16, 34);       // bits per sample
  wavBuffer.write('data', 36);
  wavBuffer.writeUInt32LE(dataSize, 40);
  pcmBytes.copy(wavBuffer, 44);

  return wavBuffer;
}

async function generateAll() {
  console.log('🎵  Generating poem audio files...');
  console.log(`📝  ${allPoems.length} poems × ${languages.length} languages = ${allPoems.length * languages.length} files`);
  console.log('🎤  Voice: ' + VOICE_NAME + ' (calm, soothing)\n');

  let count = 0;
  const total = allPoems.length * languages.length;

  for (const poem of allPoems) {
    for (const lang of languages) {
      count++;
      const filename = `${lang}-${poem.id}.wav`;
      const filepath = path.join(OUTPUT_DIR, filename);

      // Skip if already exists
      if (fs.existsSync(filepath)) {
        console.log(`⏭️  [${count}/${total}] ${filename} — already exists, skipping`);
        continue;
      }

      const text = poem.text[lang];
      if (!text) {
        console.log(`⚠️  [${count}/${total}] ${filename} — no text, skipping`);
        continue;
      }

      // Add language instruction for non-English
      let ttsText = text;
      if (lang === 'es') ttsText = `Read this poem in Spanish with emotion and warmth:\n\n${text}`;
      if (lang === 'zh') ttsText = `Read this poem in Mandarin Chinese with emotion and warmth:\n\n${text}`;
      if (lang === 'sw') ttsText = `Read this poem in Swahili with emotion and warmth:\n\n${text}`;
      if (lang === 'en') ttsText = `Read this poem with deep emotion, warmth, and a gentle spoken word cadence:\n\n${text}`;

      try {
        console.log(`🎙️  [${count}/${total}] Generating ${filename}...`);
        const inlineData = await generateTTS(ttsText);

        // Parse sample rate from mimeType
        const rateMatch = (inlineData.mimeType || '').match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000;

        const wavData = pcmToWav(inlineData.data, sampleRate);
        fs.writeFileSync(filepath, wavData);
        console.log(`   ✅ Saved (${(wavData.length / 1024).toFixed(0)} KB)`);

        // Rate limiting — 1 second between calls
        await new Promise(r => setTimeout(r, 1200));
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
        // Wait longer on error (rate limit)
        await new Promise(r => setTimeout(r, 3000));
      }
    }
  }

  console.log('\n🏁  Done! Generated audio files in: ' + OUTPUT_DIR);
}

generateAll();
