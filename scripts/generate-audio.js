const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs').promises;
const path = require('path');

// Hindi alphabet mappings
const hindiAlphabets = {
  // Vowels
  'a': 'अ',
  'aa': 'आ',
  'i': 'इ',
  'ii': 'ई',
  'u': 'उ',
  'uu': 'ऊ',
  'ri': 'ऋ',
  'e': 'ए',
  'ai': 'ऐ',
  'o': 'ओ',
  'au': 'औ',
  'am': 'अं',
  'ah': 'अः',

  // Consonants
  'ka': 'क',
  'kha': 'ख',
  'ga': 'ग',
  'gha': 'घ',
  'nga': 'ङ',
  'cha': 'च',
  'chha': 'छ',
  'ja': 'ज',
  'jha': 'झ',
  'nya': 'ञ',
  'ta': 'ट',
  'tha': 'ठ',
  'da': 'ड',
  'dha': 'ढ',
  'na': 'ण',
  'ta2': 'त',
  'tha2': 'थ',
  'da2': 'द',
  'dha2': 'ध',
  'na2': 'न',
  'pa': 'प',
  'pha': 'फ',
  'ba': 'ब',
  'bha': 'भ',
  'ma': 'म',
  'ya': 'य',
  'ra': 'र',
  'la': 'ल',
  'va': 'व',
  'sha': 'श',
  'sha2': 'ष',
  'sa': 'स',
  'ha': 'ह',
  'ksha': 'क्ष',
  'tra': 'त्र',
  'gya': 'ज्ञ'
};

async function generateAudio() {
  try {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();
    
    // Ensure audio directory exists
    const audioDir = path.join(__dirname, '..', 'public', 'audio');
    await fs.mkdir(audioDir, { recursive: true });

    // Generate audio for each alphabet
    for (const [filename, text] of Object.entries(hindiAlphabets)) {
      const request = {
        input: { text },
        voice: { languageCode: 'hi-IN', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      console.log(`Generating audio for ${text} (${filename})`);
      
      // Performs the text-to-speech request
      const [response] = await client.synthesizeSpeech(request);
      
      // Write the binary audio content to a local file
      const outputFile = path.join(audioDir, `${filename}.mp3`);
      await fs.writeFile(outputFile, response.audioContent, 'binary');
      
      console.log(`Audio content written to: ${outputFile}`);
    }

    console.log('Audio generation complete!');
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

generateAudio(); 