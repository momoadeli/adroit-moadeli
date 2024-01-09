import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/* 
  name: momo
  concept: 
    The Observable Data Store (ODS) is a base class for all services that provide 'local/global/component' state for a feature.
    A key feature is this object can run within the lifecycle of the client smart component and doesn't need to usurp global memory unlike an
    NgRx slice that stays in memory during the lifetime of the application.
  intent: 
    This is a base class for all services that that provide 'local global' state for a feature.
    This service is also gateway to all modes of data such as API responses, local storage, ngrx store, 
    etc. Additionally an ODS state can be easily promoted to a global ngRx slice once and if needed.
    As a service, it can be injected into any component. 
    It can also be overridden using Angular's DI mechanism in case an alternative implementation is needed.
*/

export class ODSState<T> {
  private state$: BehaviorSubject<T>;
  protected get state(): T {
    return this.state$.getValue();
  }

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged()
    );
  }

  protected setState(newState: Partial<T>): void {
    this.state$.next({
      ...this.state,
      ...newState,
    });
  }
}
