import AnalyticsField from './analyticsField';

export default class AnalyticsFields {
    static raise: AnalyticsField = new AnalyticsField('RAISE', '45b57158-8dd3-4e11-a564-7ddf2b980fe7');
    static fold: AnalyticsField = new AnalyticsField('FOLD', '07d3fe73-7223-498d-ab21-3929c9556e8a');
    static stand: AnalyticsField = new AnalyticsField('STAND', 'ff3f15f1-18ea-4a89-b88a-c478c582307a');
    static draw: AnalyticsField = new AnalyticsField('DRAW', 'ffc8f8ac-37b5-4a34-84d3-5d0344c5eca5');
    static call: AnalyticsField = new AnalyticsField('CALL', 'd3e27b99-0b82-49e8-9dfa-82187ee43462');
    static roundStart: AnalyticsField = new AnalyticsField('ROUND_START', '0dc6412f-1ff0-438e-a598-d3e98a42354d');
    static roundOver: AnalyticsField = new AnalyticsField('ROUND_OVER', 'f5bf2fda-06da-422a-8815-4a19319cf73b');
    static handOver: AnalyticsField = new AnalyticsField('HAND_OVER', '790852ea-c410-4056-8365-a9fd12072e07');
    static shift: AnalyticsField = new AnalyticsField('SHIFT', 'cae01f99-f746-4a22-abe6-244b2b12116d');
}