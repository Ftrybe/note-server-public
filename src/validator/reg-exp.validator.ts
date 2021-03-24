export class RegExpValidator {
    public static isMobile(number: string) {
        if (/^1[3456789]\d{9}$/.test(number)) {
            return true;
        } else {
            return false;
        }
    }
}
