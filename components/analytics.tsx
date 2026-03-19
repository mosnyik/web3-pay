"use client"

import { useEffect } from "react"
import Script from "next/script"
import { appConfig } from "@/lib/config/app"

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    mixpanel: any
    hj: (...args: any[]) => void
  }
}

export function Analytics() {
  const { googleAnalyticsId, mixpanelToken, hotjarId } = appConfig.analytics

  useEffect(() => {
    if (googleAnalyticsId) {
      window.gtag?.("config", googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [googleAnalyticsId])

  useEffect(() => {
    if (!hotjarId) return
    const h = window as any
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) }
    h._hjSettings = { hjid: hotjarId, hjsv: 6 }
    const head = document.getElementsByTagName("head")[0]
    const script = document.createElement("script")
    script.async = true
    script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=6`
    head.appendChild(script)
  }, [hotjarId])

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
            }}
          />
        </>
      )}

      {/* Mixpanel */}
      {mixpanelToken && (
        <Script
          id="mixpanel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<f.length;h++)c(a,f[h]);a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);
            mixpanel.init('${mixpanelToken}', {debug: ${process.env.NODE_ENV === "development"}});
          `,
          }}
        />
      )}

    </>
  )
}

// Analytics tracking functions
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // Google Analytics
      if (window.gtag) {
        window.gtag("event", event, properties)
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track(event, properties)
      }
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // Google Analytics
      if (window.gtag) {
        window.gtag("config", appConfig.analytics.googleAnalyticsId, {
          user_id: userId,
          custom_map: traits,
        })
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.identify(userId)
        if (traits) {
          window.mixpanel.people.set(traits)
        }
      }
    }
  },

  page: (name: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // Google Analytics
      if (window.gtag) {
        window.gtag("config", appConfig.analytics.googleAnalyticsId, {
          page_title: name,
          page_location: window.location.href,
          ...properties,
        })
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track_pageview({
          page: name,
          ...properties,
        })
      }
    }
  },
}
