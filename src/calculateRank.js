/**
 * Calculates the exponential cdf.
 *
 * @param {number} x The value.
 * @returns {number} The exponential cdf.
 */
function exponential_cdf(x) {
    return 1 - 2 ** -x;
  }
  
  /**
   * Calculates the log normal cdf.
   *
   * @param {number} x The value.
   * @returns {number} The log normal cdf.
   */
  function log_normal_cdf(x) {
    // approximation
    return x / (1 + x);
  }
  
  function calculateRank({
    percentile
  }) {
  
    const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    const LEVELS = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];
    const COLORS = [
      "#0000FF", // Blue
      "#1E00E6", // Intermediate blue
      "#3C00CC", // Intermediate blue
      "#5900B3", // Intermediate purple
      "#770099", // Intermediate purple
      "#950080", // Intermediate purple
      "#B20066", // Intermediate purple-red
      "#D1004D", // Intermediate red
      "#FF0000", // Red
    ];

    const index = THRESHOLDS.findIndex((t) => percentile <= t);
  
    const level = LEVELS[index];
    const color = COLORS[index];
  
    return { color, level };
  }
  
  export { calculateRank };
  export default calculateRank;