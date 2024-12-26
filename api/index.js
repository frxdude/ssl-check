import calculateRank from "../src/calculateRank.js";
import { renderStatsCard } from "../src/cards/stats-card.js";
import {
  clampValue,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "../src/common/utils.js";
import { fetchSSLInfo, fetchDomainInfo } from "../src/fetchers/fetcher.js";

export default async (req, res) => {
  const {
    username,
    hide,
    hide_title,
    hide_border,
    card_width,
    hide_rank,
    show_icons,
    include_all_commits,
    line_height,
    title_color,
    ring_color,
    icon_color,
    text_color,
    text_bold,
    bg_color,
    theme,
    cache_seconds,
    exclude_repo,
    custom_title,
    locale,
    disable_animations,
    border_radius,
    number_format,
    border_color,
    rank_icon,
    show,
    web_url,
    show_domain
  }
   = req.query;
  res.setHeader("Content-Type", "image/svg+xml");

  try {
    const showStats = parseArray(show);
    const stats = await fetchSSLInfo(web_url);
    if(show_domain != undefined && show_domain !== 'false') {
      const { expireAt, registrarComp, expireInDays, daysLeft } = await fetchDomainInfo(web_url);
      stats['domain'] = {
        expireAt,
        registrarComp,
        expireInDays,
        daysLeft
      }
    }

    let cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.CARD_CACHE_SECONDS, 10),
      CONSTANTS.TWELVE_HOURS,
      CONSTANTS.TWO_DAY,
    );
    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      "Cache-Control",
      `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );
    return res.send(
      `${
        show_domain !== 'false'
          ? renderStatsCard(stats, {
              hide: parseArray(hide),
              show_icons: parseBoolean(show_icons),
              hide_title: parseBoolean(hide_title),
              hide_border: parseBoolean(hide_border),
              card_width: parseInt(card_width, 10),
              hide_rank: parseBoolean(hide_rank),
              include_all_commits: parseBoolean(include_all_commits),
              line_height,
              title_color,
              ring_color,
              icon_color,
              text_color,
              text_bold: parseBoolean(text_bold),
              bg_color,
              theme,
              custom_title: `${web_url}'s Domain stats`,
              border_radius,
              border_color,
              number_format,
              locale: locale ? locale.toLowerCase() : null,
              disable_animations: parseBoolean(disable_animations),
              rank_icon,
              show: showStats,
              show_domain,
              is_domain: true,
            })
          : renderStatsCard(stats, {
              hide: parseArray(hide),
              show_icons: parseBoolean(show_icons),
              hide_title: parseBoolean(hide_title),
              hide_border: parseBoolean(hide_border),
              card_width: parseInt(card_width, 10),
              hide_rank: parseBoolean(hide_rank),
              include_all_commits: parseBoolean(include_all_commits),
              line_height,
              title_color,
              ring_color,
              icon_color,
              text_color,
              text_bold: parseBoolean(text_bold),
              bg_color,
              theme,
              custom_title: `${web_url}'s SSL stats`,
              border_radius,
              border_color,
              number_format,
              locale: locale ? locale.toLowerCase() : null,
              disable_animations: parseBoolean(disable_animations),
              rank_icon,
              show: showStats,
              show_domain,
              is_domain: false,
            })
      }`
    );
  } catch (err) {
    res.setHeader(
      "Cache-Control",
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    ); // Use lower cache period for errors.
    return res.send(
      // renderError(err.message, err.secondaryMessage, {
      renderError('Mail: <a href= "mailto: sainjargal@nubisoft.mn"> sainjargal@nubisoft.mn </a>', 'Github: <a href="https://github.com/frxdude">https://github.com/frxdude</a>', {
        title_color,
        text_color,
        bg_color,
        border_color,
        theme,
      }),
    );
  }
};