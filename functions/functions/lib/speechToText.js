"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSpeechToText = void 0;
const https_1 = require("firebase-functions/v2/https");
const speech_1 = require("@google-cloud/speech");
const speechClient = new speech_1.SpeechClient();
exports.convertSpeechToText = (0, https_1.onCall)(async (request) => {
    var _a;
    try {
        // Ensure the request is authenticated
        if (!request.auth) {
            throw new Error('The function must be called while authenticated.');
        }
        const { audioContent } = request.data;
        if (!audioContent) {
            throw new Error('The function requires an audioContent parameter.');
        }
        const speechRequest = {
            audio: {
                content: audioContent,
            },
            config: {
                encoding: speech_1.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 44100,
                languageCode: 'en-US',
            },
        };
        const [response] = await speechClient.recognize(speechRequest);
        const transcription = (_a = response.results) === null || _a === void 0 ? void 0 : _a.map((result) => { var _a, _b; return ((_b = (_a = result.alternatives) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.transcript) || ''; }).join('\n');
        return { transcription };
    }
    catch (error) {
        console.error('Speech to text conversion error:', error);
        throw new Error('An error occurred while converting speech to text.');
    }
});
//# sourceMappingURL=speechToText.js.map