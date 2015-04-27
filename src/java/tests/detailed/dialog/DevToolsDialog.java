// Copyright (c) 2014 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

package tests.detailed.dialog;

import java.awt.BorderLayout;
import java.awt.Frame;
import java.awt.Point;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;

import javax.swing.JDialog;

import org.cef.browser.CefBrowser;

@SuppressWarnings("serial")
public class DevToolsDialog extends JDialog {
  private final CefBrowser devTools_;

  public DevToolsDialog(Frame paramFrame, String paramString, CefBrowser paramCefBrowser)
  {
    super(paramFrame, paramString, false);

    setLayout(new BorderLayout());
    setSize(800, 600);
    setLocation(paramFrame.getLocation().x + 20, paramFrame.getLocation().y + 20);

    this.devTools_ = paramCefBrowser.getDevTools();
    add(this.devTools_.getUIComponent());

    addComponentListener(new ComponentAdapter()
    {
      public void componentHidden(ComponentEvent paramAnonymousComponentEvent) {
        DevToolsDialog.this.dispose();
      }
    });
  }

  public void dispose()
  {
    this.devTools_.close();
    super.dispose();
  }
}
