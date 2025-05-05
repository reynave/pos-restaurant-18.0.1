import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import interact from 'interactjs';

@Component({
  selector: 'app-table-map',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './table-map.component.html',
  styleUrl: './table-map.component.css'
})
export class TableMapComponent implements AfterViewInit {
  editable: boolean = false;
  @ViewChildren('tableEl') tableElements!: QueryList<ElementRef>;

  tables = [
    { id: 1, name: 'Table A', x: 100, y: 50, width: 100, height: 80, icon: 'assets/table-a.png' },
    { id: 2, name: 'Table B', x: 300, y: 150, width: 120, height: 90, icon: 'assets/table-b.png' },
    { id: 3, name: 'Table C', x: 200, y: 250, width: 110, height: 100, icon: 'assets/table-c.png' }
  ];


  onEditable() {
    this.editable = !this.editable;

    const newTable =
      { id: 12, name: 'Table 1212', x: 300, y: 150, width: 400, height: 80, icon: 'assets/table-a.png' };


    this.tables.push(newTable)
    // Re-bind interact to new elements
    setTimeout(() => {
      this.initializeInteract();
    });
  }
  initializeInteract() {
    const isLocked = this.editable;

    if (isLocked) {
      interact('.draggable').draggable(false).resizable(false);
    } else {
      interact('.draggable').draggable({ /* opsi */ }).resizable({ /* opsi */ });
    }


    this.tableElements.forEach((elRef, index) => {
      const el = elRef.nativeElement;
      const table = this.tables[index];

      el.setAttribute('data-x', table.x.toString());
      el.setAttribute('data-y', table.y.toString());

      interact(el)
        .draggable({
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: '#contentDiv', // atau pakai selektor: '#contentDiv'
              endOnly: true
            })
          ],
          listeners: {
            move(event) {
              const target = event.target;
              const id = target.getAttribute('data-id');
              let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
              let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            },
            end(event) {
              const target = event.target;
              const id = parseInt(target.getAttribute('data-id'), 10);
              const x = parseFloat(target.getAttribute('data-x')) || 0;
              const y = parseFloat(target.getAttribute('data-y')) || 0;

              console.log('Moved:', { id, x, y });
              // TODO: Send new position to server here
            }
          }
        })
        // .resizable({
        //   edges: { left: true, right: true, bottom: true, top: true },
        //   modifiers: [
        //     interact.modifiers.restrictEdges({
        //       outer: 'parent', // Batas resize di dalam #contentDiv
        //       endOnly: true
        //     }),
        //     interact.modifiers.restrictSize({
        //       min: { width: 80, height: 80 } // Ukuran minimal 100x100
        //     })
        //   ],
        //   listeners: {
        //     move(event) {
        //       const target = event.target;
        //       let x = parseFloat(target.getAttribute('data-x')) || 0;
        //       let y = parseFloat(target.getAttribute('data-y')) || 0;

        //       target.style.width = `${event.rect.width}px`;
        //       target.style.height = `${event.rect.height}px`;

        //       x += event.deltaRect.left;
        //       y += event.deltaRect.top;

        //       target.style.transform = `translate(${x}px, ${y}px)`;
        //       target.setAttribute('data-x', x);
        //       target.setAttribute('data-y', y);
        //     },
        //     end(event) {
        //       const target = event.target;
        //       const id = parseInt(target.getAttribute('data-id'), 10);
        //       const width = event.rect.width;
        //       const height = event.rect.height;
        //       const x = parseFloat(target.getAttribute('data-x')) || 0;
        //       const y = parseFloat(target.getAttribute('data-y')) || 0;

        //       console.log('Resized:', { id, x, y, width, height });
        //       // TODO: Send resize info to server here
        //     }
        //   }
        // });
    });
  }

  ngAfterViewInit(): void {
    this.initializeInteract();
  }
}
