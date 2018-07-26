import { IConnection } from "../../common/Exports";
import { AuthInfo, IConnectionFactory, RecognizerConfig } from "../speech/Exports";
export declare class SpeechConnectionFactory implements IConnectionFactory {
    Create: (config: RecognizerConfig, authInfo: AuthInfo, connectionId?: string) => IConnection;
    private readonly Host;
    private readonly InteractiveRelativeUri;
    private readonly ConversationRelativeUri;
    private readonly DictationRelativeUri;
    private readonly IsDebugModeEnabled;
}
