// Ownership: Robert Roach

export function arraysDifferent(arr1: (string | number)[], arr2: (string | number)[]): boolean {
    for (let i = 0; i < arr1.length; i++) {

        const val1 = arr1[i]
        const val2 = arr2[i]

        if (typeof val1 === 'number' && typeof val2 === 'number') {
            if (isNaN(val1) && isNaN(val2)) {
                continue
            }
            else if (val1 !== val2) {
                return true
            }
        }
        else if (val1 !== val2) {
            return true
        }
    }
    return false
}