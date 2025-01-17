const isAudioPath = (input) => {
    // Check if string is empty or not a string
    if (!input || typeof input !== 'string') {
        return false;
    }
    // Common audio extensions
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
    // Check if string ends with audio extension
    const hasAudioExtension = audioExtensions.some(ext => input.toLowerCase().endsWith(ext));
    return hasAudioExtension;
};
export default isAudioPath;
//# sourceMappingURL=pathChecker.js.map