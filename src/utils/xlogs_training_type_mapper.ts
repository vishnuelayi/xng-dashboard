import GetTrainingTypeOptions from "../data/get_training_type_options";
import { TrainingType } from "../profile-sdk";

export function GetTrainingTypeStringFromEnum(training_type: TrainingType){
    const training_type_options = GetTrainingTypeOptions();

    switch (training_type) {
        case TrainingType.NUMBER_0:
            return training_type_options[0];
        case TrainingType.NUMBER_1:
            return training_type_options[1];
        case TrainingType.NUMBER_2:
            return training_type_options[2];
        case TrainingType.NUMBER_3:
            return training_type_options[3];
        case TrainingType.NUMBER_4:
            return training_type_options[4];
        case TrainingType.NUMBER_5:
            return training_type_options[5];
        default:
            return training_type_options[0];
    }
}

export function GetTrainingTypeEnumFromString(training_type_string: string){
    const training_type_options = GetTrainingTypeOptions();

    switch (training_type_string) {
        case training_type_options[0]:
            return TrainingType.NUMBER_0;
        case training_type_options[1]:
            return TrainingType.NUMBER_1;
        case training_type_options[2]:
            return TrainingType.NUMBER_2;
        case training_type_options[3]:
            return TrainingType.NUMBER_3;
        case training_type_options[4]:
            return TrainingType.NUMBER_4;
        case training_type_options[5]:
            return TrainingType.NUMBER_5;
        default:
            return TrainingType.NUMBER_0;
    }
}