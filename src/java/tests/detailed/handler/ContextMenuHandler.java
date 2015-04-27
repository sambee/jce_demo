// Copyright (c) 2014 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

package tests.detailed.handler;

import java.awt.Frame;
import org.cef.browser.CefBrowser;
import org.cef.callback.CefContextMenuParams;
import org.cef.callback.CefMenuModel;
import org.cef.handler.CefContextMenuHandlerAdapter;
import tests.detailed.dialog.SearchDialog;
import tests.detailed.dialog.ShowTextDialog;

public class ContextMenuHandler extends CefContextMenuHandlerAdapter {
  private final Frame owner_;

  public ContextMenuHandler(Frame paramFrame)
  {
    this.owner_ = paramFrame;
  }

  public void onBeforeContextMenu(CefBrowser paramCefBrowser, CefContextMenuParams paramCefContextMenuParams, CefMenuModel paramCefMenuModel)
  {
    paramCefMenuModel.addItem(130, "Find...");
    if (paramCefContextMenuParams.hasImageContents())
      paramCefMenuModel.addItem(26500, "Download Image...");
  }

  public boolean onContextMenuCommand(CefBrowser paramCefBrowser, CefContextMenuParams paramCefContextMenuParams, int paramInt1, int paramInt2)
  {
    switch (paramInt1) {
      case 132:
        ShowTextDialog localShowTextDialog = new ShowTextDialog(this.owner_, "Source of \"" + paramCefBrowser.getURL() + "\"");
        paramCefBrowser.getSource(localShowTextDialog);
        return true;
      case 130:
        SearchDialog localSearchDialog = new SearchDialog(this.owner_, paramCefBrowser);
        localSearchDialog.setVisible(true);
        return true;
      case 26500:
        paramCefBrowser.startDownload(paramCefContextMenuParams.getSourceUrl());
        return true;
    }
    return false;
  }
}
