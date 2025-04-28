import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SpeechClient, protos } from '@google-cloud/speech';

admin.initializeApp();

interface SpeechToTextData {
    audioContent: string;
}

// Export the function with explicit region
export const convertSpeechToText = functions
    .region('us-central1')
    .https
    .onCall(async (data, context) => {
        if (!context.auth) {
            throw new Error('Unauthorized');
        }

        const { audioContent } = data as SpeechToTextData;
        if (!audioContent) {
            throw new Error('No audio content provided');
        }

        const speechClient = new SpeechClient();
        const speechRequest: protos.google.cloud.speech.v1.IRecognizeRequest = {
            audio: {
                content: audioContent,
            },
            config: {
                encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
                sampleRateHertz: 44100,
                languageCode: 'en-US',
                model: 'video',
                useEnhanced: true,
                metadata: {
                    recordingDeviceType: protos.google.cloud.speech.v1.RecognitionMetadata.RecordingDeviceType.SMARTPHONE,
                    originalMediaType: protos.google.cloud.speech.v1.RecognitionMetadata.OriginalMediaType.VIDEO,
                },
            },
        };

        try {
            const [response] = await speechClient.recognize(speechRequest);
            const transcription = response.results
                ?.map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) =>
                    result.alternatives?.[0]?.transcript || ''
                )
                .join('\n');

            return { transcription };
        } catch (error) {
            console.error('Error in speech recognition:', error);
            throw new Error('Failed to process speech');
        }
    }); 