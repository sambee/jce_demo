package tests.detailed.handler;

import java.awt.Frame;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import org.cef.browser.CefBrowser;
import org.cef.callback.CefGeolocationCallback;
import org.cef.handler.CefGeolocationHandlerAdapter;

public class GeolocationHandler extends CefGeolocationHandlerAdapter
{
    private final Frame owner_;

    public GeolocationHandler(Frame paramFrame)
    {
        this.owner_ = paramFrame;
    }

    public void onRequestGeolocationPermission(CefBrowser paramCefBrowser, String paramString, int paramInt, CefGeolocationCallback paramCefGeolocationCallback)
    {
        final CefGeolocationCallback localCefGeolocationCallback = paramCefGeolocationCallback;
        final String str = paramString;
        SwingUtilities.invokeLater(new Runnable()
        {
            public void run() {
                int i = JOptionPane.showConfirmDialog(GeolocationHandler.this.owner_, "The URL \n" + str + "\nwants to request your geolocation." + "\nDo you want to proceed?", "Geolocation requested", 0, 3);

                localCefGeolocationCallback.Continue(i == 0);
            }
        });
    }
}