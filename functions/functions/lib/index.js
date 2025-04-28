"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSpeechToText = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const speech_1 = require("@google-cloud/speech");
admin.initializeApp();
// Export the function with explicit region
exports.convertSpeechToText = functions
    .region('us-central1')
    .https
    .onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new Error('Unauthorized');
    }
    const { audioContent } = data;
    if (!audioContent) {
        throw new Error('No audio content provided');
    }
    const speechClient = new speech_1.SpeechClient();
    const speechRequest = {
        audio: {
            content: audioContent,
        },
        config: {
            encoding: speech_1.protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
            sampleRateHertz: 44100,
            languageCode: 'en-US',
            model: 'video',
            useEnhanced: true,
            metadata: {
                recordingDeviceType: speech_1.protos.google.cloud.speech.v1.RecognitionMetadata.RecordingDeviceType.SMARTPHONE,
                originalMediaType: speech_1.protos.google.cloud.speech.v1.RecognitionMetadata.OriginalMediaType.VIDEO,
            },
        },
    };
    try {
        const [response] = await speechClient.recognize(speechRequest);
        const transcription = (_a = response.results) === null || _a === void 0 ? void 0 : _a.map((result) => { var _a, _b; return ((_b = (_a = result.alternatives) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.transcript) || ''; }).join('\n');
        return { transcription };
    }
    catch (error) {
        console.error('Error in speech recognition:', error);
        throw new Error('Failed to process speech');
    }
});
//# sourceMappingURL=index.js.map