import { notify } from '@affine/component';
import { getAffineCloudBaseUrl } from '@affine/core/modules/cloud/services/fetch';
import { I18n } from '@affine/i18n';
import { LinkIcon } from '@blocksuite/icons/lit';
import {
  DocsService,
  type FrameworkProvider,
  WorkspaceService,
} from '@toeverything/infra';

export function createToolbarMoreMenuConfig(framework: FrameworkProvider) {
  return {
    configure: groups => {
      const clipboardGroup = groups.find(group => group.type === 'clipboard');

      if (clipboardGroup) {
        const copyIndex = clipboardGroup.items.findIndex(
          item => item.type === 'copy'
        );
        clipboardGroup.items.splice(
          copyIndex + 1,
          0,
          createCopyLinkToBlockMenuItem(framework)
        );
      }

      return groups;
    },
  };
}

function createCopyLinkToBlockMenuItem(
  framework: FrameworkProvider,
  item = {
    icon: LinkIcon({ width: '20', height: '20' }),
    label: 'Copy link to block',
    type: 'copy-link-to-block',
    showWhile: ctx => !ctx.isEmpty(),
  }
) {
  return {
    ...item,
    action: ctx => {
      const baseUrl = getAffineCloudBaseUrl();
      if (!baseUrl) return;

      let str;

      // mode = page | edgeless
      // `?mode={mode}&blockId={bid}`
      // `?mode={mode}&elementId={eid}`
      try {
        const workspace = framework.get(WorkspaceService).workspace;
        const docsService = framework.get(DocsService);
        const workspaceId = workspace.id;
        const pageId = ctx.doc.id;
        const mode = docsService.list.getPrimaryMode(pageId) ?? 'page';
        const url = new URL(`${baseUrl}/workspace/${workspaceId}/${pageId}`);
        const searchParams = url.searchParams;

        searchParams.append('mode', mode);
        if (mode === 'page') {
          // maybe multiple blocks
          const ids = ctx.selectedBlockModels.map(model => model.id);
          searchParams.append('blockId', ids.join(','));
        } else if (mode === 'edgeless' && ctx.firstElement) {
          // single block/element
          if (ctx.isElement()) {
            searchParams.append('elementId', ctx.firstElement.id);
          } else {
            searchParams.append('blockId', ctx.firstElement.id);
          }
        }

        str = url.toString();
      } catch (e) {
        console.error(e);
      }

      if (!str) return;

      navigator.clipboard
        .writeText(str)
        .then(() => {
          notify.success({
            title: I18n['Copied link to clipboard'](),
          });
        })
        .catch(console.error);
    },
  };
}
